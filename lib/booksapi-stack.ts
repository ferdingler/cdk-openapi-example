import * as cdk from "@aws-cdk/core";
import { SpecRestApi, ApiDefinition } from "@aws-cdk/aws-apigateway";
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as yaml from "yamljs";
import * as fs from "fs";

export class BooksApiStack extends cdk.Stack {
  private lambdaHandler: Function;
  private restApi: SpecRestApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.buildLambdaFunction();
    this.buildApiGateway();
  }

  /**
   * Creates Lambda Function that will handle requests from API Gateway.
   * Given that the API Gateway is being created from an OpenAPI document,
   * we need to explicitely give permissions to this Lambda function to be
   * invoked by the REST API.
   */
  buildLambdaFunction() {
    this.lambdaHandler = new Function(this, "BooksApiHandler", {
      runtime: Runtime.NODEJS_12_X,
      description: "Handles traffic from the Books API",
      code: Code.fromAsset("src/"),
      handler: "index.handler",
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
    });

    const stack = cdk.Stack.of(this);
    this.lambdaHandler.addPermission("Invoke", {
      sourceArn: `arn:${stack.partition}:execute-api:${stack.region}:${stack.account}:${this.restApi.restApiId}/*`,
      principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });
  }

  buildApiGateway() {
    const openApiSpec = this.parseOpenApiSpec();
    this.restApi = new SpecRestApi(this, "BooksApi", {
      apiDefinition: ApiDefinition.fromInline(openApiSpec),
    });
  }

  /**
   * Reads the local file openapi.yaml, replaces the ${ApiLambda.Arn} string in
   * the YAML file with a CDK token that is resolved during synthesis. The OpenAPI
   * specification is embedded in CloudFormation as a normal expression that itself
   * resolves the LambdaArn during deployment.
   *
   * This is necessary because CDK does not currently support parametrizing the
   * OpenAPI documents. https://github.com/aws/aws-cdk/issues/1461
   */
  parseOpenApiSpec() {
    const openapiyaml = fs.readFileSync("openapi.yaml", "utf8");
    let spec = openapiyaml.replace(
      "${ApiLambda.Arn}",
      this.lambdaHandler.functionArn
    );

    const openapi = yaml.parse(spec);
    return openapi;
  }
}
