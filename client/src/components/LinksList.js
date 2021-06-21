import React from 'react';
import {Link} from 'react-router-dom';


export const LinksList=({links}) =>{

if (!links) {
    return (
    <p className='center'>No links found</p>
    )
}


    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Basic url</th>
                    <th>Shortened url</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {links.map((link,index)=>{
                    return (
                        <tr key={link._id}>
                            <td>{index+1}</td>
                            <td>{link.from}</td>
                            <td>{link.to}</td>
                            <td>
                                <Link to={`/detail/${link._id}`}>Detail</Link>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}