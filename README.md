# rules-validation-api
   

#### How should this be manually tested?
- clone the application
- run `npm install`
- run `npm start`



Run localhost:8000/api/v1

#### Endpoints
```
- GET '/'
- POST '/validate-rule'
- Payload for POST request
{
    "rule": {
        "field": `string (The field in the data passed to validate the rule against)`,
        "condition": `string (The condition to use for validating the rule -- eq, neq, gt, gte, contains)`,
        "condition_value": `string | number (The condition value to run the rule against)`
    },
    "data": `object | array | string`
}
```

