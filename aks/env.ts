import * as envalid from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config({ path: "./aks.env"});

interface AksProperties {
    LOCATION: string;
    VM_SIZE: string;
    NODE_COUNT: number,
    CLIENT_ID: string;
    CLIENT_SECRET: string;
}

const validators = {
    LOCATION: envalid.str(),
    VM_SIZE: envalid.str(),
    NODE_COUNT: envalid.num(),
    CLIENT_ID: envalid.str(),
    CLIENT_SECRET: envalid.str()
};

const aksProps = envalid.cleanEnv<AksProperties>(process.env, validators);

export {aksProps as aksProps};
