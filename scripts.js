// Modal
const Modal = {
    open() {
        // Abrir Modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        //Fechar Modal
        //Remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

// Criando o local de armazenamento da aplicação
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("Laux")) || []
    },

    set(transactions) {
        localStorage.setItem("Laux", JSON.stringify(transactions))
    }
}

// criando as funcionalidades
const Transaction = {
    all: Storage.get(),

    // Adiciona uma transação
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },
    // Remove uma transação
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    // Soma as entradas
    incomes() {
        // somando o total de entradas
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },

    // Soma as saídas
    expenses() {
        // somando o total de saídas
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    // Imprimi o total
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

// Substituir os dados do HTML com os dados do JS
const DOM = {
    // Pegando o tbody
    transactionsContainer: document.querySelector('#data-table tbody'),

    // Criando o TR
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    // Mudando a cor de acordo com Negativo e Positivo
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" :
            "expense"

        // Busca a formatação dos números
        const amount = Utils.formatCurrency(transaction.amount)

        // Estrutura da transação
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html
    },

    // Atualizando os valores dos cards
    uptateBalance() {
        document.getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    // Limpar as transações para poder dar Reload
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

// Funcionalidades úteis para o programa
const Utils = {
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatCurrency(value) {
        // Sinal de negativo e positivo
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

// Pegando os dados do formulário de adição de transação
const Form = {
    // Pegando os inputs do Form
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    // Pegando os valores dos inputs
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    // Função de validar os dados
    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos!")
            }
    },

    // Formatando os dados
    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    // Função que salva as transações
    saveTransaction(transaction) {
        Transaction.add(transaction)

    },

    // Função que limpa os campos do formulário
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        // Tirar o comportamento padrão do formulário
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()
            
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    // Inicia o APP
    init() {
        // Adicionando as Transações ao html
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        // Atualizando os cards
        DOM.uptateBalance()

        // Atualizando o LocalStorage
        Storage.set(Transaction.all)
    },

    // Recarrega o APP
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()

