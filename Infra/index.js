"use strict";
const fs = require("fs");
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");

// Read the public key from the local file system
const publicKey = fs.readFileSync(`${process.env.HOME}/.ssh/id_rsa.pub`, "utf-8");

// Create a Key Pair in AWS using the public key
const keyPair = new aws.ec2.KeyPair("my-key-pair", {
    publicKey: publicKey,
});

// Create a VPC
const vpc = new aws.ec2.Vpc("my-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: "my-vpc",
    },
});

// Create an Internet Gateway
const internetGateway = new aws.ec2.InternetGateway("igw", {
    vpcId: vpc.id,
    tags: {
        Name: "igw",
    },
});

// Create a Public Subnet
const publicSubnet = new aws.ec2.Subnet("public-subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "ap-southeast-1a", // Change this to your desired AZ
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "public-subnet",
    },
});

// Create a Route Table
const routeTable = new aws.ec2.RouteTable("public-rt", {
    vpcId: vpc.id,
    routes: [
        {
            cidrBlock: "0.0.0.0/0",
            gatewayId: internetGateway.id,
        },
    ],
    tags: {
        Name: "public-rt",
    },
});

// Associate the Route Table with the Public Subnet
new aws.ec2.RouteTableAssociation("route-table-association", {
    subnetId: publicSubnet.id,
    routeTableId: routeTable.id,
});

// Create a Security Group
const securityGroup = new aws.ec2.SecurityGroup("security-group", {
    description: "Allow inbound HTTP and SSH traffic",
    vpcId: vpc.id,
    ingress: [
        {
            protocol: "tcp",
            fromPort: 22,
            toPort: 22,
            cidrBlocks: ["0.0.0.0/0"],
        },
        {
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"],
        },
        // {
        //     protocol: "tcp",
        //     fromPort: 3000,
        //     toPort: 3000,
        //     cidrBlocks: ["0.0.0.0/0"],
        // },
    ],
    egress: [
        {
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
});

// Create an EC2 instance
const ec2Instance = new aws.ec2.Instance("my-ec2-instance", {
    instanceType: "t2.micro",
    vpcSecurityGroupIds: [securityGroup.id],
    ami: "ami-060e277c0d4cce553", // change the value accordingly
    subnetId: publicSubnet.id,
    keyName: keyPair.keyName, // Reference the created key pair
});

exports.publicIp = ec2Instance.publicIp;

