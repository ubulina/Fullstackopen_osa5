describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Tiina Testaaja',
            username: 'tite',
            password: 'hyshyshys'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('Log in to application')
        cy.get('#username')
        cy.get('#password')
        cy.get('#login-button')
    })


    describe('Login', function() {
        it('succeeds with correct credentials', function(){
            cy.contains('Log in to application')
            cy.get('#username').type('tite')
            cy.get('#password').type('hyshyshys')
            cy.get('#login-button').click()

            cy.contains('Tiina Testaaja logged in')

        })

        it('fails with wrong credentials', function(){
            cy.contains('Log in to application')
            cy.get('#username').type('tite')
            cy.get('#password').type('hushushus')
            cy.get('#login-button').click()

            cy.get('.error')
                .should('have.css', 'color', 'rgb(255, 0, 0)')

            cy.get('html').should('not.contain', 'Tiina Testaaja logged in')

        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'tite', password: 'hyshyshys' })
        })

        it('A blog can be created', function() {
            cy.contains('create new blog').click()
            cy.get('#title').type('Nallekarhu tarinoi')
            cy.get('#author').type('Nalle Luppakorva')
            cy.get('#url').type('http://www.nalletarinoita.fi')
            cy.get('#submit-button').click()

            cy.contains('Nallekarhu tarinoi Nalle Luppakorva')
            cy.get('#view-button')

        })

        describe('and a blog exists', function(){
            describe('and several blogs exist', function(){
                beforeEach(function(){
                    cy.createBlog({ title: 'Hyvä blogi', author: 'Tupu', url: 'http://www.hyvablogi.com' })
                    cy.createBlog({ title: 'Parempi blogi', author: 'Hupu', url: 'http://www.parempiblogi.com' })
                    cy.createBlog({ title: 'Paras blogi', author: 'Lupu', url: 'http://www.parasblogi.com' })
                })

                it('User can like a blog', function(){
                    cy.contains('Paras blogi Lupu').parent().find('#view-button').click()

                    cy.contains('Paras blogi Lupu')
                        .parent().contains('likes 0')
                        .parent().find('#like-button').click()

                    cy.contains('Paras blogi Lupu')
                        .parent().contains('likes 1')
                })

                it('the blogs are ordered according to likes the blog with the most likes being first', function(){


                    //Tupun blogin tykkäykset - 1
                    //Hupun blogin tykkäykset - 3
                    //Lupun blogin tykkäykset - 2

                    //Tupulle yksi tykkäys
                    cy.contains('Hyvä blogi Tupu').parent().find('#view-button').click()
                        .wait(2000)
                    cy.contains('Hyvä blogi Tupu').parent().find('#like-button').as('theTupuButton')
                        .wait(2000)
                    cy.get('@theTupuButton').click()
                        .wait(5000)


                    //Hupulle kaksi tykkäystä
                    cy.contains('Parempi blogi Hupu').parent().find('#view-button').click()
                        .wait(2000)
                    cy.contains('Parempi blogi Hupu').parent().find('#like-button').as('theHupuButton')
                        .wait(2000)
                    cy.get('@theHupuButton').click()
                        .wait(10000)
                    cy.get('@theHupuButton').click()
                        .wait(10000)


                    //Lupulle kaksi tykkäystä
                    cy.contains('Paras blogi Lupu').parent().find('#view-button').click()
                        .wait(2000)
                    cy.contains('Paras blogi Lupu').parent().find('#like-button').as('theLupuButton')
                        .wait(2000)
                    cy.get('@theLupuButton').click()
                        .wait(10000)
                    cy.get('@theLupuButton').click()
                        .wait(10000)

                    //yksi lisätykkäys Hupulle
                    cy.contains('Parempi blogi Hupu').parent().find('#like-button').as('theHupuButton')
                        .wait(2000)
                    cy.get('@theHupuButton').click()
                        .wait(10000)

                    cy.get('span').then( blogs => {
                        console.log('number of blogs', blogs.length)
                        cy.wrap(blogs[0]).should('contain', 'Parempi blogi Hupu')
                        cy.wrap(blogs[1]).should('contain', 'Paras blogi Lupu')
                        cy.wrap(blogs[2]).should('contain', 'Hyvä blogi Tupu')
                    })

                })

                it('User can remove a blog', function() {
                    cy.contains('Hyvä blogi Tupu').parent().find('#view-button').click()

                    cy.contains('Hyvä blogi Tupu').parent().find('#remove-button').click()

                    cy.get('html').should('not.contain', 'Hyvä blogi Tupu')

                })
            })
        })

    })
})



