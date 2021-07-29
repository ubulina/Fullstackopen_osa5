import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

    const testBlog = {
        title: 'Hiirenkorvia',
        author: 'Mikki',
        url: 'http://www.hiirenkorvia.fi',
        likes: 1

    }


    test('at start renders title and author, but does not render url and likes', () => {

        const component = render(
            <Blog blog={testBlog} />
        )

        const div = component.container.querySelector('.moreInfo')

        expect(div).toHaveStyle('display: none')

    })

    test('after clicking the button, url and likes are displayed', () => {

        const component = render(
            <Blog blog={testBlog} />
        )

        const button = component.getByText('view')
        fireEvent.click(button)

        const div = component.container.querySelector('.moreInfo')
        expect(div).not.toHaveStyle('display: none')

    })

    test('if the like button is clicked twice, the event handler addLike is called twice', () => {

        const mockHandler = jest.fn()

        const component = render(
            <Blog blog={testBlog} addLike={mockHandler} />
        )

        const button = component.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockHandler.mock.calls).toHaveLength(2)

    })

})



