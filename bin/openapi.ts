#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { OpenapiStack } from '../lib/openapi-stack';

const app = new cdk.App();
new OpenapiStack(app, 'OpenapiStack');
