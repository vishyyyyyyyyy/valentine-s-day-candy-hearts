document.addEventListener('DOMContentLoaded', function(){
	const box = document.getElementById('box');
	const container = document.getElementById('boxContainer');
	if(!box || !container) return;

	function activateBox(){
		// only open once; ignore further presses
		if(container.classList.contains('open')) return;

		box.classList.add('pressed');
		setTimeout(()=> box.classList.remove('pressed'), 200);

		container.classList.add('open');
		box.setAttribute('aria-pressed', 'true');

		// update the subtitle text and move it up; remove the header logo/heading
		const header = document.querySelector('.site-header');
		if(header){
			const subtitle = header.querySelector('.subtitle');
			if(subtitle){
				subtitle.textContent = 'Click the hearts~';
				subtitle.classList.add('subtitle--up');
			} else {
				const p = document.createElement('p');
				p.className = 'subtitle subtitle--up';
				p.textContent = 'Click the hearts~';
				header.appendChild(p);
			}

			const h1 = header.querySelector('h1');
			if(h1) h1.remove();
			const hh = header.querySelector('.header-heart');
			if(hh) hh.remove();
		}
	}

	box.addEventListener('click', activateBox);

	// keyboard access: Enter or Space
	box.addEventListener('keydown', function(e){
		if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
			e.preventDefault();
			activateBox();
		}
	});
});
