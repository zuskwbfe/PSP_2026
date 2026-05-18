
export function findExclusiveRequests(allAccounts, processedAccounts) {
    const exclusiveAccounts = [];
    let accountIndex = 0;

    while (accountIndex < allAccounts.length) {
        const currentAccount = allAccounts[accountIndex];
        const accountNumber = currentAccount.account_number || currentAccount.id;
        let isAlreadyProcessed = false;
        let searchPointer = 0;

        while (searchPointer < processedAccounts.length && !isAlreadyProcessed) {
            const processedAccountNumber = processedAccounts[searchPointer].account_number
                                         || processedAccounts[searchPointer].id;
            if (String(accountNumber) === String(processedAccountNumber)) {
                isAlreadyProcessed = true;
            }
            searchPointer++;
        }

        if (!isAlreadyProcessed) {
            exclusiveAccounts.push({
                id: accountNumber,
                client_name: currentAccount.client_name || currentAccount.account,
                service_type: currentAccount.service,
                status: currentAccount.status || 'pending'
            });
        }
        accountIndex++;
    }
    return exclusiveAccounts;
}

export function flattenServiceCategories(nestedServiceTree) {
    const flattenedServices = [];
    const processingStack = [...nestedServiceTree];

    do {
        const currentItem = processingStack.pop();
        if (Array.isArray(currentItem)) {
            for (let reverseIndex = currentItem.length - 1; reverseIndex >= 0; reverseIndex--) {
                processingStack.push(currentItem[reverseIndex]);
            }
        } else if (currentItem !== undefined && currentItem !== null) {
            flattenedServices.push(
                typeof currentItem === 'string' ? currentItem.trim() : currentItem
            );
        }
    } while (processingStack.length > 0);

    return flattenedServices;
}


export const TEST_DATA = {
    diff: {
        allAccounts: [
            { id: 101, account_number: 'ACC-2024-001', client_name: 'Кофейня «Уголок»', service: 'Доставка расходников', status: 'Новая' },
            { id: 102, account_number: 'ACC-2024-002', client_name: 'Салон «Локон»', service: 'Ремонт оборудования', status: 'В работе' },
            { id: 103, account_number: 'ACC-2024-003', client_name: 'Магазин «Цветы»', service: 'Установка кассы', status: 'Завершена' },
            { id: 104, account_number: 'ACC-2024-004', client_name: 'Пекарня «Зерно»', service: 'Доставка расходников', status: 'Новая' },
            { id: 105, account_number: 'ACC-2024-005', client_name: 'Ателье «Игла»', service: 'Консультация', status: 'Новая' }
        ],
        processedAccounts: [
            { id: 102, account_number: 'ACC-2024-002' },
            { id: 104, account_number: 'ACC-2024-004' }
        ]
    },
    flatten: {
        nested: [
            "Доставка",
            ["Ремонт", ["Диагностика", "Замена деталей", ["Гарантийное обслуживание", "Постгарантийный ремонт"]], "Настройка"],
            "Установка",
            ["Обучение персонала", "Консультация"]
        ]
    }
};


if (typeof window !== 'undefined') {
    console.log('Запуск тестов функций домашнего задания');
    console.log('='.repeat(60));

    // Тест 1: diff
    console.log('\n ТЕСТ 1: findExclusiveRequests (diff)');
    const { allAccounts, processedAccounts } = TEST_DATA.diff;
    const result1 = findExclusiveRequests(allAccounts, processedAccounts);
    console.log('Найдено заявок для отправки подарков:', result1.length);
    result1.forEach((acc, i) => console.log(`   ${i+1}. ${acc.client_name} [${acc.account_number}] — ${acc.service_type}`));

    // Тест 2: flatten
    console.log('\n ТЕСТ 2: flattenServiceCategories (flatten)');
    const result2 = flattenServiceCategories(TEST_DATA.flatten.nested);
    console.log('Плоский список услуг:', result2.length);
    result2.forEach((svc, i) => console.log(`   ${i+1}. ${svc}`));

}
