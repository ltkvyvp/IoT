import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { deviceService, alertService } from '@/_services';


function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = id? false: true;
    const initialValues = {
        name: '',
        code: '',
        topic: '',
        type: '',
    };
    
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Không được để trống'),
        code: Yup.string()
            .required('Không được để trống'),
        topic: Yup.string()
            .required('Không được để trống'),
        type: Yup.string()
            .required('Không được để trống'),
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode) {
            createDevice(fields, setSubmitting);
        } else {
            updateDevice(id, fields, setSubmitting);
        }
    }

    function createDevice(fields, { setStatus, setSubmitting }) {
        deviceService.create(fields)
            .then(() => {
                alertService.success('Thêm thiết bị thành công', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateDevice(id, fields, { setStatus, setSubmitting }) {

        deviceService.update(id, fields)
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
                
                useEffect(() => {
                    if (!isAddMode) {
                        // get device and set form fields
                        // console.log('1');
                        deviceService.getById(id).then(device => {
                            const fields = ['name', 'code', 'topic','type'];
                            fields.forEach(field => setFieldValue(field, device[field], false));
                        });
                    }
                }, []);
                return (
                    <Form>
                        <h2>{isAddMode ? 'Thêm thiết bị' : 'Chỉnh sửa thiết bị'}</h2>
                        <div className="form-row">
                            <label>Tên</label>
                            <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </div>
                        <br />
                        <div className="form-row">
                            <label>Mã thiết bị</label>
                            <Field name="code" type="text" className={'form-control' + (errors.code && touched.code ? ' is-invalid' : '')}>
                            </Field>
                            <ErrorMessage name="code" component="div" className="invalid-feedback" />
                        </div>
                        <br />
                        <div className="form-row" >
                            <label>Topic</label>
                            <Field name="topic" type="text" className={'form-control' + (errors.topic && touched.topic ? ' is-invalid' : '')}>
                            </Field>
                            <ErrorMessage name="topic" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row" >
                            <label>Loại thiết bị</label>
                            <Field name="type" type="text" className={'form-control' + (errors.type && touched.type ? ' is-invalid' : '')}>
                            </Field>
                            <ErrorMessage name="type" component="div" className="invalid-feedback" />
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