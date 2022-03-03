import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { accountService, alertService } from '@/_services';

function VerifyEmail({ history }) {
    const EmailStatus = {
        Verifying: 'Verifying',
        Failed: 'Failed'
    }

    const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

    useEffect(() => {
        const { token } = queryString.parse(location.search);

        // remove token from url to prevent http referer leakage
        history.replace(location.pathname);

        accountService.verifyEmail(token)
            .then(() => {
                alertService.success('Xác minh thành công, bây giờ bạn có thể đăng nhập', { keepAfterRouteChange: true });
                history.push('login');
            })
            .catch(() => {
                setEmailStatus(EmailStatus.Failed);
            });
    }, []);

    function getBody() {
        switch (emailStatus) {
            case EmailStatus.Verifying:
                return <div>Đang xác thực ...</div>;
            case EmailStatus.Failed:
                return <div>Xác minh không thành công, bạn cũng có thể xác minh tài khoản của mình bằng cách chọn <Link to="forgot-password">"đổi mật khẩu"</Link></div>;
        }
    }

    return (
        <div>
            <h3 className="card-header">Xác thực Email</h3>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}

export { VerifyEmail }; 