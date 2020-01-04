const ring_icon = require('./../../assets/images/ring@2x.png')
const kton_icon = require('./../../assets/images/kton@2x.png')
const ksm_icon = require('./../../assets/images/ksm@2x.png')

export default [{
  name: 'darwinia',
  value: {
    balances: {
      value: "RING",
      icon: ring_icon
    },
    kton: {
      value: "KTON",
      icon: kton_icon
    },
    domain: {
      value: 'https://crayfish.subscan.io'
    },
    donate: {
      address: '5DobnXBB9EU8gJR8ygCM5GvHHuvSRCfWypuC2vDqW35Udbku'
    }
  }
}, {
  name: 'icefrog',
  value: {
    balances: {
      value: "RING",
      icon: ring_icon
    },
    kton: {
      value: "KTON",
      icon: kton_icon
    },
    power: {
      value: "POWER",
      icon: ring_icon
    },
    domain: {
      value: 'https://icefrog.subscan.io'
    },
    donate: {
      address: '5DobnXBB9EU8gJR8ygCM5GvHHuvSRCfWypuC2vDqW35Udbku'
    }
  }
}, {
  name: 'kusama',
  value: {
    balances: {
      value: "KSM",
      icon: ksm_icon
    },
    kton: {
      value: "KTON",
      icon: kton_icon
    },
    domain: {
      value: 'https://kusama.subscan.io'
    },
    donate: {
      address: 'HSCAN7hmLKGY6G866YwrscY9SQPWFLwMGetD8aq2roeqUbo'
    }
  }
}]
