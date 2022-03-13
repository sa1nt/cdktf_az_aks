# Replicating [Provision an AKS Cluster](https://learn.hashicorp.com/tutorials/terraform/aks?in=terraform/azure) in CDK TF

To use TF "random_pet" in CDKTF: 
1. Add `"hashicorp/random@3.1.0"` to `cdktf.json` file
2. Use as `let random_pet = new random.Pet(this, "server", {}); let random_pet = new Pet(this, "random-pet");`

See also [Variables and Outputs](https://www.terraform.io/cdktf/concepts/variables-and-outputs#define-output-values)


Instead of using TF variables to provide Service Principal details, better store the details in an `.env` file and read using `dotenv` and `envalid` packages. 

# Deploy 

Note: ensure that aks.env and ../az_tf_creds.env are set up

1. `cdktf synth` to convert typescript to Terraform
2. `cd cdktf.out/stacks/aks`
3. `terraform apply`
4. ??? 
5. `terraform destroy`
