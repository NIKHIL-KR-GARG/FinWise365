import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssetPropertyList = () => {

    const [properties, setProperties] = useState([]);
    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`/api/asset_properties?user_id=${currentUserId}`);
                setProperties(response.data);
           } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();

    }, [currentUserId]);

    return (
        <div>
            <h1>Asset Property List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Property Name</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map(property => (
                        <tr key={property.id}>
                            <td>{property.property_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>  
    )
}

export default AssetPropertyList;