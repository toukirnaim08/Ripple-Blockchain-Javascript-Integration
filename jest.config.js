const config = {
    verbose: true,
    testTimeout: 45000,
    bail: true,
    forceExit: true
}

module.exports = config

// Or async function
module.exports = async () => {
    return config;
};
