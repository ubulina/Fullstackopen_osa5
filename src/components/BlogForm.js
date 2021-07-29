import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    //App-komponentilta propsina saatu funktio
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url
        })

        setTitle('')
        setAuthor('')
        setUrl('')

    }

    return(
        <div className="formDiv">
            <h2>create new</h2>

            <form id="blog-form" onSubmit={addBlog}>
                <div>
                title:
                <input
                    id="title"
                    type="text"
                    value={title}
                    name="Title"
                    onChange={handleTitleChange}
                />
                </div>
                <div>
                author:
                <input
                    id="author"
                    type="text"
                    value={author}
                    name="Author"
                    onChange={handleAuthorChange}
                />
                </div>
                <div>
                url:
                <input
                    id="url"
                    type="text"
                    value={url}
                    name="Url"
                    onChange={handleUrlChange}
                />
                </div>
                <button id='submit-button' type="submit">create</button>
            </form>
        </div>
    )

}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}


export default BlogForm