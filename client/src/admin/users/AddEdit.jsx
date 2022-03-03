import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CustomSelect from './CustomSelect';

import { accountService, alertService, deviceService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = id? false: true;
    const initialValues = {
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        isBanned: '',
        devices: [],
        listAllDevice : []
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Không được để trống'),
        lastName: Yup.string()
            .required('Không được để trống'),
        gender: Yup.string()
            .required('Giới tính không được để trống'),
        birthday: Yup.date()
            .required("Ngày không hợp lệ "),
        email: Yup.string()
            .email('Email không hợp lệ ')
            .required('Không được để trống'),
        role: Yup.string()
            .required('Không được để trống'),
        password: Yup.string()
            .concat(isAddMode ? Yup.string().required('Không được để trống') : null)
            .min(6, 'Mật khẩu cần tối thiểu 6 kí tự'),
        confirmPassword: Yup.string()
            .when('password', (password, schema) => {
                if (password) return schema.required('Yêu cầu xác nhận mật khẩu');
            })
            .oneOf([Yup.ref('password')], 'Sai mật khẩu'),
        isBanned: Yup.bool().required('Không được để trống'),
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        fields['devices'] = fields['devices'].map(x => x.value);
        if (isAddMode) {
            createUser(fields, setSubmitting);
        } else {
            updateUser(id, fields, setSubmitting);
        }
    }

    function createUser(fields, { setStatus, setSubmitting }) {
        accountService.create(fields)
            .then(() => {
                alertService.success('Thêm người dùng thành công', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateUser(id, fields, { setStatus, setSubmitting }) {
        console.log(fields);
        accountService.update(id, fields)
            .then(() => {
                alertService.success('Cập nhật thành công', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }


    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                let listAllDevice = [];
                useEffect(() => {
                    deviceService.getAll().then(devices => {
                        devices.map(device => {
                            listAllDevice.push({
                                value: device.id,
                                label: device.name
                            })
                        })
                        setFieldValue('listAllDevice', listAllDevice, false);
                    })

                    if (!isAddMode) {
                        // get user and set form fields
                        // console.log('1');
                        accountService.getById(id).then(user => {
                            const fields = ['firstName', 'lastName', 'gender', 'birthday', 'email', 'role', 'isBanned' ];
                            fields.forEach(field => setFieldValue(field, user[field], false));
                            let userDevice = [];
                            user['devices'].forEach(x => {
                                listAllDevice.forEach(device => {
                                    if (device.value == x) userDevice.push(device);
                                })
                            })
                            setFieldValue('devices', userDevice, false);
                        });
                    }
                }, []);

                return (
                    <Form >
                        <h2>{isAddMode ? 'Thêm người dùng' : 'Chỉnh sửa thông tin người dùng'}</h2>
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
                        <div className="form-row">
                            <div className="form-group col-7">
                                <label>Email</label>
                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Role</label>
                                <Field name="role" as="select" className={'form-control' + (errors.role && touched.role ? ' is-invalid' : '')}>
                                    <option value=""></option>
                                    <option value="User">Người dùng</option>
                                    <option value="Admin">Admin</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Danh sách thiết bị</label>
                                <Field 
                                    name="devices" 
                                    component={CustomSelect} 
                                    fieldOption={'listAllDevice'}
                                >
                                </Field>
                            </div>
                        </div>
                        {isAddMode &&
                            <div className="form-group" >
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <Field name="isBanned" as="select" className={'form-control' + (errors.isBanned && touched.isBanned ? ' is-invalid' : '')}>
                                        <option value=""></option>
                                        <option value="true">Khoá</option>
                                        <option value="false">Không khoá</option>
                                    </Field>
                                    <ErrorMessage name="isBanned" component="div" className="invalid-feedback" />
                                </div>
                            </div>
                        }
                        {!isAddMode &&
                            <div >
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <Field name="isBanned" as="select" className={'form-control' + (errors.isBanned && touched.isBanned ? ' is-invalid' : '')}>
                                        <option value=""></option>
                                        <option value="true">Khoá</option>
                                        <option value="false">Không khoá</option>
                                    </Field>
                                    <ErrorMessage name="isBanned" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-row">
                                    <h4 className="pt-3">Đổi mật khẩu</h4>
                                </div>
                            </div>
                        }

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
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Lưu thay đổi
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Huỷ</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };