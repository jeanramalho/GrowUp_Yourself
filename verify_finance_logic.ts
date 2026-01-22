
import { financeService } from './src/services/FinanceService';
import { database } from './src/repositories/Repository';

const runVerification = async () => {
    try {
        console.log("Starting Verification...");
        await database.init();

        // 1. Create a Test Account
        const account = await financeService.createAccount({
            nome: 'Test Account',
            tipo: 'carteira',
            saldo_inicial: 1000
        });
        console.log(`Created Account: ${account.nome}, Initial Balance: ${account.saldo_inicial}`);

        // 2. Verify Initial Balance
        let accounts = await financeService.getAccountsWithBalance();
        let myAccount = accounts.find(a => a.id === account.id);
        console.log(`[1] Balance after create (Expect 1000): ${myAccount?.saldo_atual}`);

        if (myAccount?.saldo_atual !== 1000) throw new Error("Initial balance check failed");

        // 3. Add Expense Transaction
        const transaction = (await financeService.createTransaction({
            tipo: 'despesa',
            valor: 100,
            categoria: 'Test',
            data: new Date().toISOString().split('T')[0],
            planejado: false,
            conta_id: account.id,
            nota: 'Test Expense'
        }))[0];
        console.log("Added Expense: -100");

        // 4. Verify Balance after Expense
        accounts = await financeService.getAccountsWithBalance();
        myAccount = accounts.find(a => a.id === account.id);
        console.log(`[2] Balance after expense (Expect 900): ${myAccount?.saldo_atual}`);

        if (myAccount?.saldo_atual !== 900) throw new Error("Balance check after expense failed");

        // 5. Update Transaction (Change value to 200)
        await financeService.updateTransaction(transaction.id, { valor: 200 });
        console.log("Updated Expense: -200");

        // 6. Verify Balance after Update
        accounts = await financeService.getAccountsWithBalance();
        myAccount = accounts.find(a => a.id === account.id);
        console.log(`[3] Balance after update (Expect 800): ${myAccount?.saldo_atual}`);

        if (myAccount?.saldo_atual !== 800) throw new Error("Balance check after update failed");

        // 7. Delete Transaction
        await financeService.deleteTransaction(transaction.id);
        console.log("Deleted Expense");

        // 8. Verify Balance after Delete
        accounts = await financeService.getAccountsWithBalance();
        myAccount = accounts.find(a => a.id === account.id);
        console.log(`[4] Balance after delete (Expect 1000): ${myAccount?.saldo_atual}`);

        if (myAccount?.saldo_atual !== 1000) throw new Error("Balance check after delete failed");

        console.log("SUCCESS: All verification steps passed!");

        // Cleanup (optional, but good for local dev)
        // await financeService.deleteAccount(account.id); // Assuming deleteAccount exists or we leave it

    } catch (error) {
        console.error("VERIFICATION FAILED:", error);
        process.exit(1);
    }
};

runVerification();
