import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { accountService, alertService } from '@/_services';

function Update({ history }) {
    const user = accountService.userValue;

    const initialValues = {
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        birthday: user.birthday,
        email: user.email,
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Không được để trống'),
        lastName: Yup.string()
            .required('Không được để trống'),
        gender: Yup.string()
            .required('Không được để trống giới tính'),
        birthday: Yup.date()
            .required("Ngày không hợp lệ"),
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Không được để trống Email'),
        password: Yup.string()
            .min(6, 'Mật khẩu cần ít nhất 6 kí tự'),
        confirmPassword: Yup.string()
            .when('password', (password, schema) => {
                if (password) return schema.required('Yêu cầu xác nhận mật khẩu');
            })
            .oneOf([Yup.ref('password')], 'Mật khẩu sai'),
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        accountService.update(user.id, fields)
            .then(() => {
                alertService.success('Cập nhật thành công', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }
    const [isDeleting, setIsDeleting] = useState(false);
    function onDelete() {
        if (confirm('Xác nhận?')) {
            setIsDeleting(true);
            accountService.delete(user.id)
                .then(() => alertService.success('Xoá tài khoản thành công'));
        }
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <h1>Cập nhật thông tin tài khoản</h1>
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
                    <h3 className="pt-3">Đổi mật nhẩu</h3>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>Mật khẩu mới</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <label>Xác nhận mật khẩu mới</label>
                            <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                            <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Xác nhận
                        </button>
                        <button type="button" onClick={() => onDelete()} className="btn btn-danger" style={{ width: '75px' }} disabled={isDeleting}>
                            {isDeleting
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>Xoá</span>
                            }
                        </button>
                        <Link to="." className="btn btn-link">Huỷ</Link>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export { Update };