import React from 'react';

export const LinkCard=({link})=> {
return (
    <>
    <h2>Link</h2>
    <p>Shortened url: <a href={link.to} target='_blank' rel='noopener noreferrer'>{link.to}</a></p>
    <p>Basic url: <a href={link.from} target='_blank' rel='noopener noreferrer'>{link.from}</a></p>
    <p>Total clicks: <strong>{link.clicks}</strong></p>
    <p>Created: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
    </>
)
}