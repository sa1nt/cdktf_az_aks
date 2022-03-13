import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AzurermProvider, ContainerRegistry, KubernetesCluster, ResourceGroup, RoleAssignment } from "./.gen/providers/azurerm";
import * as random from "./.gen/providers/random"
import { aksProps } from "./env";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AzurermProvider(this, "AzureRm", {
      features: {}
    });
    
    new random.RandomProvider(this, "random", {});

    let random_pet = new random.Pet(this, "server", {});
    let random_name = random_pet.id;

    let rg = new ResourceGroup(this, "rg-example", {
      name: `${random_name}-rg`,
      location: aksProps.LOCATION
    });

    let random_string_resource = new random.StringResource(this, "random_string", {
      length: 20,
      lower: true,
      minLower: 20,
      minNumeric: 0,
      minSpecial: 0,
      minUpper: 0
    });

    let acr = new ContainerRegistry(this, "acr", {
      name: `${random_string_resource.result}acr`,
      location: rg.location,
      resourceGroupName: rg.name,
      sku: "Basic",

      /**
       * Only available for "Premium" SKU
      retentionPolicy: [
        {
          enabled: true,
          days: 2
        }
      ]
      */
    });

    let aks = new KubernetesCluster(this, "aks", {
      name: `${random_name}-aks`,
      location: rg.location,
      resourceGroupName: rg.name,
      dnsPrefix: `${random_name}-k8s`,

      defaultNodePool: {
        name: "default",
        vmSize: aksProps.VM_SIZE,
        nodeCount: aksProps.NODE_COUNT
      },

      identity: {
        type: "SystemAssigned"
      },

      /**
       * Service Principal deprecated in favor of "identity" block
      servicePrincipal: {
        clientId: aksProps.CLIENT_ID,
        clientSecret: aksProps.CLIENT_SECRET
      },
       */
      roleBasedAccessControl: {
        enabled: true
      },

      tags: {
        "environment": "Demo"
      }
    });

    new RoleAssignment(this, "acrpull", {
      principalId: aks.kubeletIdentity.objectId,
      scope: acr.id,
      roleDefinitionName: "AcrPull",
      skipServicePrincipalAadCheck: true
    });
  }
}

const app = new App();
new MyStack(app, "aks");
app.synth();
