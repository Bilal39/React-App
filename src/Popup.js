import React from 'react'

const Popup = ({ title, content, handleClose }) => {
	return (
		<div className='popup'>
			<header
				style={{
					color: title.includes('Information')
						? 'green'
						: title.includes('informations')
						? 'blue'
						: 'red',
				}}
			>
				<h1>{title}</h1>
				<strong onClick={() => handleClose()}>x</strong>
			</header>
			<div className='popup-content'>
				<strong>{content}</strong>
				<div>
					<button onClick={() => handleClose()}>Ok</button>
				</div>
			</div>
		</div>
	)
}

export default Popup
