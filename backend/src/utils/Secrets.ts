import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const awsConfig = {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
};

const client = new SecretsManagerClient(awsConfig);

export async function getSecretValue(secretName: string) {
    try {
        const response = await client.send(
            new GetSecretValueCommand({ SecretId: secretName })
        );

        if (!response.SecretString) {
            throw new Error("SecretString is undefined");
        }
        return JSON.parse(response.SecretString);
    } catch (error) {
        console.error("Error fetching secret:", error);
        throw error;
    }
}
