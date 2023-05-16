# any-doc-classifier

This project contains source code and supporting files for a serverless application that you can deploy with the AWS Serverless Application Model (AWS SAM) 
The project exposes an API to manage documents information and be able to classify them with comprehend. It includes the following files and folders:

- `src` - Code for the application's Lambda functions.
- `template.yaml` - A template that defines the application's AWS resources and reference the stack deployed from the main project. 
- 
To get started, see the following:

* [MainProject](https://github.com/estebance/open_ai_doc_inference)

## Deploy the sample application

To use the AWS SAM CLI, you need the following tools:

* AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
* Node.js - [Install Node.js 16](https://nodejs.org/en/), including the npm package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

To build and deploy the application for the first time reference to the main project: 

If you just want to deploy the APIs and apply new changes to this project, run the following in your shell:

```bash
sam build --use-container 
cd .aws-sam/build/
# for the first time 
sam deploy --guided 
# after 
sam deploy --config-file ../../samconfig.toml
```

The first command will build the source of your application. The second command will package and deploy your application to AWS
The API Gateway endpoint API will be displayed in the outputs when the deployment is complete.

## Project Structure 

* **file-manager**: this lambda function exposes an Express API with the following routes:
  * 
* **textract-checker**: due you can upload files with a couple of pages, we have created a SQS trigger to process asynchronously the files text extraction 


TODO 