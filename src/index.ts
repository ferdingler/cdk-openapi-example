import { APIGatewayProxyEvent, Context } from "aws-lambda";
import * as serverlessExpress from "aws-serverless-express";
import api from "./api";

const server = serverlessExpress.createServer(api);

/**
 * Lambda entry handler for HTTP requests
 * coming from API Gateway.
 *
 * @param event
 */
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  console.log("Event=", JSON.stringify(event));
  console.log("Context=", JSON.stringify(context));

  const response = serverlessExpress.proxy(server, event, context);
  console.log("Response=", JSON.stringify(response));

  return response;
};
