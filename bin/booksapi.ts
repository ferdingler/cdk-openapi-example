#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { BooksApiStack } from "../lib/booksapi-stack";

const app = new cdk.App();
new BooksApiStack(app, "BooksApiStack");
