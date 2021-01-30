import User from "../../models/userModel.js";
import userData from "../../utilities/userData.js"
import errorHandler from "../../helpers/errorHandler.js"
import rulesRouter from "./index.js";



export default class RulesController {

    static index ( req, res ) {
        try {
            let user = new User();

            user.name = userData.name;
            user.github = userData.github;
            user.email = userData.email;
            user.mobile = userData.mobile;
            user.twitter = userData.twitter;

            return res.status(200).json({
                message : 'My Rule-Validation API',
                status : 'success',
                data : user
            });
        }
        catch (error) {
            errorHandler.handle(error.message, 500, res);
        }
    }


    static validateRule ( req, res ) {
        try {
            const { body } = req;

            // Check the validity of JSON payload
            if ( typeof body !== 'object' ) {
                errorHandler.handle('Invalid JSON payload passed.', 400, res);
            }

            // Check for rule and data fields in body
            if ( !body.hasOwnProperty('rule') )
                errorHandler.handle('rule is required', 400, res);
            if ( !body.hasOwnProperty('data') )
                errorHandler.handle('data is required', 400, res);

            const { rule, data } = body;

            // Check the data types of rule and data
            if ( typeof rule !== 'object' )
                errorHandler.handle('rule should be a JSON Object', 400, res);

            let dataIsValid = false;
            if ( typeof data === 'object' || Array.isArray(data) || typeof data === 'string' )
                dataIsValid = true;

            if ( !dataIsValid )
                errorHandler.handle('data should be a JSON Object, Array or String', 400, res);

            // Check rule fields
            if ( !rule.hasOwnProperty('field') )
                errorHandler.handle('rule.field is required', 400, res);

            if ( !rule.hasOwnProperty('condition') )
                errorHandler.handle('rule.condition is required', 400, res);

            if ( !rule.hasOwnProperty('condition_value') )
                errorHandler.handle('rule.condition_value is required', 400, res);

            const { field, condition, condition_value } = rule;

            // Check for empty rule keys
            if ( !field || !field.trim )
                errorHandler.handle('rule.field cannot be empty', 400, res);
            if ( !condition || !condition.trim )
                errorHandler.handle('rule.condition cannot be empty', 400, res);
            if ( !condition_value )
                errorHandler.handle('rule.condition_value cannot be empty', 400, res);
            
            // Split string to obtain nested fields
            let splittedField = field.split('.');

            if ( splittedField.length > 2 )
                errorHandler.handle('Nesting should not be more than two levels', 400, res);

            // Check for fields and nested fields in data
            switch ( splittedField.length ) {
                case 1 : 
                    if ( typeof data === 'object' && !data.hasOwnProperty(splittedField[0]) ) {
                        errorHandler.handle('field '+splittedField[0]+' is missing from data', 400, res);
                    }
                    if (Array.isArray(data) || typeof data === 'string') {
                        if (!data[splittedField]) {
                            errorHandler.handle('field '+splittedField[0]+' is missing from data', 400, res);
                        }
                    }
                    break;
                case 2 :
                    if ( !data.hasOwnProperty(splittedField[0]) ) {
                        errorHandler.handle('field '+splittedField[0]+' is missing from data', 400, res);
                    }
                    else if ( !data[splittedField[0]].hasOwnProperty(splittedField[1])) {
                        errorHandler.handle('field '+field+' is missing from data', 400, res);
                    }
                    break;
            }

            // Validate Conditions
            let errData;
            switch ( condition ) {
                case 'eq' : 
                    if ( splittedField.length < 2 ) {
                        if ( data[splittedField[0]] === condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ splittedField[0] +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field : splittedField[0],
                                        field_value : data[splittedField[0]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ splittedField[0] +' failed validation.', 400, res, errData);
                        }
                    }
                    else {
                        if ( data[splittedField[0]][splittedField[1]] === condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ field +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]][splittedField[1]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]][splittedField[1]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ field +' failed validation.', 400, res, errData);
                        }
                    }
                    break;
                
                case 'neq' :
                    if ( splittedField.length < 2 ) {
                        if ( data[splittedField[0]] !== condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ splittedField[0] +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ splittedField[0] +' failed validation.', 400, res, errData);
                        }
                    }
                    else {
                        if ( data[splittedField[0]][splittedField[1]] !== condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ field +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field : splittedField[0],
                                        field_value : data[splittedField[0]][splittedField[1]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]][splittedField[1]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ field +' failed validation.', 400, res, errData);
                        }
                    }
                    break;

                case 'gt' :
                    if ( splittedField.length < 2 ) {
                        if ( data[splittedField[0]] > condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ splittedField[0] +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ splittedField[0] +' failed validation.', 400, res, errData);
                        }
                    }
                    else {
                        if ( data[splittedField[0]][splittedField[1]] > condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ field +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]][splittedField[1]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]][splittedField[1]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ field +' failed validation.', 400, res, errData);
                        }
                    }
                    break;
                    
                case 'gte' :
                    if ( splittedField.length < 2 ) {
                        if ( data[splittedField[0]] >= condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ splittedField[0] +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ splittedField[0] +' failed validation.', 400, res, errData);
                        }
                    }
                    else {
                        if ( data[splittedField[0]][splittedField[1]] >= condition_value ) {
                            return res.status(200).json({
                                message : 'field '+ field +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]][splittedField[1]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]][splittedField[1]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ field +' failed validation.', 400, res, errData);
                        }
                    }
                    break;

                case 'contains' : 
                    if ( splittedField.length < 2 ) {
                        if ( data[splittedField[0]].includes(condition_value) ) {
                            return res.status(200).json({
                                message : 'field '+ splittedField[0] +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            return res.status(400).json({
                                message : 'field '+ splittedField[0] +' failed validation.',
                                status : 'error',
                                data : {
                                    validation : {
                                        error : true,
                                        field,
                                        field_value : data[splittedField[0]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                    }
                    else {
                        if ( data[splittedField[0]][splittedField[1]].includes(condition_value) ) {
                            return res.status(200).json({
                                message : 'field '+ field +' successfully validated.',
                                status : 'success',
                                data : {
                                    validation : {
                                        error : false,
                                        field,
                                        field_value : data[splittedField[0]][splittedField[1]],
                                        condition,
                                        condition_value
                                    }
                                }
                            });
                        }
                        else {
                            errData = {
                                validation : {
                                    error : true,
                                    field,
                                    field_value : data[splittedField[0]][splittedField[1]],
                                    condition,
                                    condition_value
                                }
                            };
                            errorHandler.handle('field '+ field +' failed validation.', 400, res, errData);
                        }
                    }
                break;
            }
        }
        catch (error) {
            errorHandler.handle(error.message, 500, res);
        }
        
    }
}