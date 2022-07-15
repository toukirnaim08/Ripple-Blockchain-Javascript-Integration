async function transactionMockHandler(body) {
    const input = {
        query: {
            "TransactionType": "Payment",
            "Account": 'rn54TBHXvWfwWpGYnCHeETTpJAXUQp73jX',
            "Amount": "0.001",
            "Destination": 'rKSRW6fEuD2KCq3J4oYWWeE8BPK4gJu5PF',
            "Fee": "0.0001",
        },
        secret: 'ss7VkpEK4E6CqBY4sUouJ1FLdJYU3'
    };
    if(body.Destination == input.query.Destination && body.Account == input.query.Account) 
    {
        return {hash: 'onzXEzuigrHW8NCFndiUJxeME58HSs6tr6LBbjwPSKuiouZ9Mpc'};
    }
    // Handle 404
    return '404';
}

module.exports = {
    transactionMockHandler
  }