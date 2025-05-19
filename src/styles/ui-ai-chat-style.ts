import React from "react";

export function appEntryStyle():React.CSSProperties{
    return {
        display: 'flex', 
        height: '100vh', 
        fontFamily: 'Arial, sans-serif'
    }
}

export function projectListStyle(isSelected: boolean): React.CSSProperties {
    return {
        padding: '8px 12px',
        backgroundColor: isSelected ? '#eef' : '#f8f8f8',
        marginBottom: '4px',
        cursor: 'pointer',
        borderRadius: '4px'
    }
}

export function newProjectStyle():React.CSSProperties{
    return {
        marginTop: '20px', 
        padding: '8px 12px', 
        cursor: 'pointer'
    }
}

export function mainViewStyle():React.CSSProperties{
    return{
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '20px', 
        boxSizing: 'border-box'
    }
}