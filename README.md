# OpenAPI and CDK

This repository is a CDK-based application that creates an Amazon API Gateway REST API using the openapi.yaml file. The API is backed by a Lambda Function that handles the requests coming from API Gateway. The OpenAPI document uses API Gateway extensions to define the Lambda handler and the Request validation configuration.

## Project structure

```bash
cdk-openapi-example
├── README.md
├── package.json
├── cdk.json
├── openapi.yaml                # OpenAPI spec, uses Amazon API Gateway extensions
├── bin
│   └── booksapi.ts             # CDK Application is defined
├── lib
│   └── booksapi-stack.ts       # CloudFormation stack that creates REST API and Lambda
└── src                         # Source code folder for the Lambda function (NodeJS app)
    ├── index.ts                # Entry point for the Lambda handler
    ├── package.json            # Dependencies for the Lambda function
    └── api
    │    ├── index.ts           # Definition of ExpressJS routes and Middlewares
    │    └── books-api.ts       # Definition for Book-specific routes
    └── controllers
         └── books-ctrl.ts      # Implementation of the ExpressJS route handlers
```

## Useful commands

- `npm run deploy` builds and deploys the application to an AWS account.
