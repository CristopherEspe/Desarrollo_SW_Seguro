describe('Users page', () => {
    beforeEach(() => {
        cy.viewport(1366, 768)
    });

    it('Users page should have the appropriate title', () => {
        cy.visit('http://localhost/users')
        cy.get('.container h2').should('contain', 'Usuarios')
    });

    it('Users page should have a table with users', () => {
        cy.visit('http://localhost/users')
        cy.get('.container table.p-datatable-table').should('exist')

        const table = cy.get('.container table.p-datatable-table')
        table.get('thead tr th').should('have.length', 5)
        table.get('tbody tr').should('have.length.greaterThan', 0)
    });

    it('Should create a new user', () => {
        cy.visit('http://localhost/users/add');
        cy.get('#name').type('Test Doe');
        cy.get('#email').type('testdoe@gmail.com');
        cy.get('#password').type('12345');

        cy.wait(1000);

        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/users');
        cy.get('.container table.p-datatable-table').should('exist');
        const lastRow = cy.get('.container table.p-datatable-table tbody tr:last-child');
        const tds = lastRow.find('td');

        tds.should('have.length', 5);

        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(1).should('contain', 'Test Doe');
        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(2).should('contain', 'testdoe@gmail.com');

        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(3).find('button').click();
        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(3).should('contain', '12345');
    });

    it('Should delete a user', () => {
        cy.visit('http://localhost/users')
        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(1).should('contain', 'Test Doe');
        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(2).should('contain', 'testdoe@gmail.com');
        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(3).find('button').click();
        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(3).should('contain', '12345');

        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(4).find('button').click();
        const deleteButton = cy.get('p-table .p-menu ul li:nth-child(2) a');
        deleteButton.click();
        cy.get('.p-dialog-footer button').contains('Yes').click();
        cy.wait(1000);
        cy.get('.container table.p-datatable-table tbody tr:last-child td').eq(1).not('contain', 'Test Doe');
    });
})