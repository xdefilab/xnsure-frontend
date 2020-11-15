import OPEN_CONTROLLER from './OptionController.json';

const env = 'development'

export interface ContractMeta {
    address: string;
    abi: any[];
}

const dev_map: { [key: string]: ContractMeta } = {
    OptionController: {
        address: '0xE1823628707D7Eb4c6fE0639dF0d1506b3e0fBCC',
        abi: OPEN_CONTROLLER.abi
    }
}

export function getContractMeta(contractName: string): ContractMeta {
    if (env) {
        return dev_map[contractName] ? dev_map[contractName] : {address: '', abi: []};
    }
    return {address: '', abi: []};
}