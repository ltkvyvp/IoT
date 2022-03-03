import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function Register({ history }) {
    const initialValues = {
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Họ không được để trống'),
        lastName: Yup.string()
            .required('Tên không được để trống'),
        gender: Yup.string()
            .required('Giới tính không được để trống'),
        birthday: Yup.date()
            .required("Ngày không hợp lệ "),
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Email không được để trống'),
        password: Yup.string()
            .min(6, 'Mật khẩu cần chứa ít nhất 6 kí tự')
            .required('Mật khẩu không được để trống'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không giống nhau')
            .required('Yêu cầu xác nhận mật khẩu'),
        acceptTerms: Yup.bool()
            .oneOf([true], 'Yêu cầu chấp nhận các điều khoản & điều kiện')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        accountService.register(fields)
            .then(() => {
                alertService.success('Đăng ký thành công, vui lòng kiểm tra email của bạn để biết hướng dẫn xác minh', { keepAfterRouteChange: true });
                history.push('login');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <h3 className="card-header">Đăng ký</h3>
                    <div className="card-body">
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Họ</label>
                                <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-6">
                                <label>Tên</label>
                                <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-4">
                                <label>Giới tính</label>
                                <Field name="gender" as="select" className={'form-control' + (errors.gender && touched.gender ? ' is-invalid' : '')}>
                                    <option value=""></option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Others">Khác</option>
                                </Field>
                                <ErrorMessage name="gender" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-8">
                                <label>Ngày sinh</label>
                                <Field name="birthday" type="date" className={'form-control' + (errors.birthday && touched.birthday ? ' is-invalid' : '')} />
                                <ErrorMessage name="birthday" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Mật khẩu</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Xác nhận mật khẩu</label>
                                <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group form-check">
                            <Field type="checkbox" name="acceptTerms" id="acceptTerms" className={'form-check-input ' + (errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : '')} />
                            <label htmlFor="acceptTerms" className="form-check-label">Tôi đồng ý với các điều khoản & điều kiện</label>
                            <ErrorMessage name="acceptTerms" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Đăng ký
                            </button>
                            <Link to="login" className="btn btn-link">Đã có tài khoản?</Link>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export { Register }; 