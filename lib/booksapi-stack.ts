import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as yaml from "yamljs";
import * as fs from "fs";

export class BooksApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const stack = cdk.Stack.of(this);

    const lambdaHandler = new lambda.Function(this, "BooksApiHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      description: "Handles traffic from the Books API",
      code: lambda.Code.fromAsset("src/"),
      handler: "index.handler",
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
    });

    const openapiyaml = fs.readFileSync("openapi.yaml", "utf8");
    let spec = openapiyaml.replace(
      "${ApiLambda.Arn}",
      lambdaHandler.functionArn
    );

    const openapi = yaml.parse(spec);
    const api = new apigateway.SpecRestApi(this, "BooksApi", {
      apiDefinition: apigateway.ApiDefinition.fromInline(openapi),
    });

    lambdaHandler.addPermission("Invoke", {
      sourceArn: `arn:${stack.partition}:execute-api:${stack.region}:${stack.account}:${api.restApiId}/*`,
      principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });
  }
}
