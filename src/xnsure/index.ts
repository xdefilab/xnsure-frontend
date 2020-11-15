import OPEN_CONTROLLER from './OptionController.json';

const env = 'development'

export interface ContractMeta {
    address: string;
    abi: any[];
}

const dev_map: { [key: string]: ContractMeta } = {
    OptionController: {
        address: '0xBFdc756AAD0EeB73785E3C0Be67C5F4C4c3010d9',
        abi: OPEN_CONTROLLER.abi
    }
}

export function getContractMeta(contractName: string): ContractMeta {
    if (env) {
        return dev_map[contractName] ? dev_map[contractName] : {address: '', abi: []};
    }
    return {address: '', abi: []};
}