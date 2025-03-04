describe('Courses page', () => {
    beforeEach(() => {
        cy.viewport(1366, 768)
    });

    it('Courses page should have the appropriate title', () => {
        cy.visit('http://localhost/courses')
        cy.get('.container h2').should('contain', 'Cursos')
    });

    it('Courses page should have a table with courses', () => {
        cy.visit('http://localhost/courses')
        cy.get('.container table.p-datatable-table').should('exist')

        const table = cy.get('.container table.p-datatable-table')
        table.get('thead tr th').should('have.length', 5)
        table.get('tbody tr').should('have.length.greaterThan', 0)
    });

    it('Should create a new course', () => {
        cy.visit('http://localhost/courses/add');
        cy.get('#name').type('Test Course');
        cy.get('#description').type('Test Description');

        cy.get('button[type="submit"]').click();
        cy.wait(1000);

        cy.url().should('include', '/courses');
        cy.get('.container table.p-datatable-table').should('exist');

        const lastRow = cy.get('.container table.p-datatable-table tbody tr:first-child');
        const tds = lastRow.find('td');

        tds.should('have.length', 5);

        cy.get('.container table.p-datatable-table tbody tr:first-child td').eq(1).should('contain', 'Test Course');
        cy.get('.container table.p-datatable-table tbody tr:first-child td').eq(2).should('contain', 'Test Description');
    });

    it('Should delete a course', () => {
        cy.visit('http://localhost/courses')
        cy.get('.container table.p-datatable-table tbody tr:first-child td').eq(1).should('contain', 'Test Course');
        cy.get('.container table.p-datatable-table tbody tr:first-child td').eq(2).should('contain', 'Test Description');

        cy.get('.container table.p-datatable-table tbody tr:first-child td').eq(4).find('button').click();
        const deleteButton = cy.get('p-table .p-menu ul li:nth-child(2) a');
        deleteButton.click();
        cy.get('.p-dialog-footer button').contains('Yes').click();
        cy.wait(1000);
        cy.get('.container table.p-datatable-table tbody tr:first-child td').eq(1).not('contain', 'Test Course');
    });
});