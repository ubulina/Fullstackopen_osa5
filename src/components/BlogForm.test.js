import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {


    const createBlog = jest.fn()

    const component = render(
        <BlogForm createBlog={createBlog} />
    )

    const title = component.container.querySelector('#title')

    fireEvent.change(title, {
        target: { value: 'Hiiren elämää' }
    })

    const author = component.container.querySelector('#author')

    fireEvent.change(author, {
        target: { value: 'Mikki' }
    })

    const url = component.container.querySelector('#url')

    fireEvent.change(url, {
        target: { value: 'http://www.hiirenelamaa.fi' }
    })

    const form = component.container.querySelector('#blog-form')

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)

    //console.log(createBlog.mock.calls[0][0])
    //console.log(createBlog.mock.calls[0][0].title)

    expect(createBlog.mock.calls[0][0].title).toBe('Hiiren elämää')
    expect(createBlog.mock.calls[0][0].author).toBe('Mikki')
    expect(createBlog.mock.calls[0][0].url).toBe('http://www.hiirenelamaa.fi')


})