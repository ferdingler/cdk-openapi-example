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
    this.addInvokePermissions();
  }

  /**
   * Creates Lambda Function that will handle requests from API Gateway.
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
  }

  buildApiGateway() {
    const openApiSpec = this.parseOpenApiSpec();
    this.restApi = new SpecRestApi(this, "BooksApi", {
      apiDefinition: ApiDefinition.fromInline(openApiSpec),
    });
  }

  /**
   * Given that the API is created from an OpenAPI document, CDK doesn't automatically
   * give permissions to the Lambda function to be invoked. We need to explicitely add
   * a Resource Policy on the Lambda so that API Gateway can invoke it.
   */
  addInvokePermissions() {
    const stack = cdk.Stack.of(this);
    this.lambdaHandler.addPermission("Invoke", {
      sourceArn: `arn:${stack.partition}:execute-api:${stack.region}:${stack.account}:${this.restApi.restApiId}/*`,
      principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
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
