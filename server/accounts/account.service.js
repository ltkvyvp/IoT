const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');
const Account = db.Account;
const RefreshToken = db.RefreshToken;
const dayjs = require('dayjs');

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password, ipAddress }) {
    const account = await Account.findOne({ email: email });

    if (account?.isBanned || !account || !account?.isVerified || !(await bcrypt.compare(password, account?.passwordHash))) {
        if (account && account?.isBanned) {
            throw 'Tài khoản đã bị khoá';
        }
        else {
            throw 'Mật khẩu hoặc tài khoản không đúng';
        }
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const account = await Account.findById(refreshToken.accountId);

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function register(params, origin) {
    // validate
    if (await Account.findOne({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    // create account object
    const account = new Account(params);

    // registered account is an admin if there're no admins
    const firstAdmin = await Account.findOne({
        role: "Admin" 
    });
    let isFirstAdmin = false;
    if (!firstAdmin) isFirstAdmin = true;
    account.role = isFirstAdmin ? Role.Admin : Role.User;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = await hash(params.password);

    // save account
    await account.save();

    // send email
    await sendVerificationEmail(account, origin);
}

async function verifyEmail({ token }) {
    const account = await Account.findOne({ verificationToken: token  });

    if (!account) throw 'Verification failed';

    account.verified = Date.now();
    account.verificationToken = null;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await Account.findOne({ email: email });

    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = randomTokenString();
    account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await Account.findOne({
            resetToken: token,
            resetTokenExpires: { $gte: Date.now() }
    });

    if (!account) throw 'Invalid token';

    return account;
}

async function resetPassword({ token, password }) {
    const account = await validateResetToken({ token });

    // update password and remove reset token
    account.passwordHash = await hash(password);
    account.passwordReset = Date.now();
    account.resetToken = null;
    await account.save();
}

async function getAll() {
    const accounts = await Account.find();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}

async function create(params) {
    // validate
    if (await Account.findOne( { email: params.email } )) {
        throw 'Email "' + params.email + '" đã được sử dụng';
    }

    const account = new Account(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = await hash(params.password);

    // save account
    await account.save();
}

async function update(id, params) {
    const account = await getAccount(id);

    // validate (if email was changed)
    if (params.email && account.email !== params.email && await Account.findOne({ email: params.email } )) {
        throw 'Email "' + params.email + '" đã được sử dụng';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    await Account.findByIdAndRemove(id);
}

// helper functions

async function getAccount(id) {
    const account = await Account.findById(id);
    if (!account) throw 'Không tồn tại tài khoản';
    return account;
}

async function getRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token: token  });
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account._id, id: account._id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
        accountId: account._id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
    let { _id, firstName, lastName, gender, birthday, email, role, isVerified, isBanned, devices } = account;
    birthday = dayjs(birthday).format('YYYY-MM-DD');
    let id = _id;
    return { id, firstName, lastName, gender, birthday, email, role, isVerified, isBanned, devices };
}

async function sendVerificationEmail(account, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/account/verify-email?token=${account.verificationToken}`;
        message = `<p>Nhấn vào link bên dưới để xác nhận tài khoản</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
        message = `<p>Vui lòng sử dụng mã thiết bị dưới đây để xác minh địa chỉ email của bạn với <code>/account/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Xác thực Email đăng ký',
        html: `<h4>Xác thực Email</h4>
               ${message}`
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>Nếu bạn không biết mật khẩu của mình, vui lòng truy cập <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>Nếu bạn không biết mật khẩu của mình, bạn có thể đặt lại mật khẩu qua <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'Đăng ký bằng Email đã được sử dụng',
        html: `<h4>Email đã được sử dụng</h4>
               <p>Email : <strong>${email}</strong> đã được đăng kí bằng tài khoản khác.</p>
               ${message}`
    });
}

async function sendPasswordResetEmail(account, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/account/reset-password?token=${account.resetToken}`;
        message = `<p>Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Vui lòng sử dụng mã thiết bị dưới đây để đặt lại mật khẩu của bạn với <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Xác thực đặt lại mật khẩu',
        html: `<h4>Đặt lại mật khẩu</h4>
               ${message}`
    });
}