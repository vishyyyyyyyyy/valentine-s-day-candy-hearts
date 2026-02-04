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
		let subtitle;
		if(header){
			subtitle = header.querySelector('.subtitle');
			if(subtitle){
				// hide existing subtitle until hearts settle
				subtitle.classList.add('subtitle--hidden');
			} else {
				// create hidden subtitle to show later
				subtitle = document.createElement('p');
				subtitle.className = 'subtitle subtitle--hidden';
				header.appendChild(subtitle);
			}

			const h1 = header.querySelector('h1');
			if(h1) h1.remove();
			const hh = header.querySelector('.header-heart');
			if(hh) hh.remove();
		}

		// after open animation finishes, move box away and center/enlarge hearts
		setTimeout(()=>{
			container.classList.add('settled');
			// when settled transitions complete, reveal and move up the subtitle
			setTimeout(()=>{
				if(subtitle){
					subtitle.textContent = 'Click the hearts~';
					subtitle.classList.remove('subtitle--hidden');
					subtitle.classList.add('subtitle--up');
				}
			}, 650);
		}, 900);
	}

	box.addEventListener('click', activateBox);

	// keyboard access: Enter or Space
	box.addEventListener('keydown', function(e){
		if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
			e.preventDefault();
			activateBox();
		}
	});

	// ---- heart modal behavior ----
	const modal = document.getElementById('heartModal');
	const modalImg = document.getElementById('modalHeartImg');
	const modalText = document.getElementById('modalHeartText');
	const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;
	let currentHeart = null;

	function openModalForHeart(heartEl){
		if(!modal) return;
		const closeup = heartEl.dataset.closeup || heartEl.getAttribute('src') || '';
		modalImg.src = closeup;
		modalImg.alt = heartEl.alt || '';
		if(modalText) modalText.textContent = heartEl.dataset.text || heartEl.alt || '';
		modal.classList.add('open');
		modal.setAttribute('aria-hidden','false');
		currentHeart = heartEl;
	}

	function closeModal(){
		if(!modal) return;
		modal.classList.remove('open');
		modal.setAttribute('aria-hidden','true');
		modalImg.src = '';
		if(modalText) modalText.textContent = '';

		// replace the heart image with the crumb image (if provided)
		if(currentHeart && currentHeart.dataset.crumb){
			currentHeart.src = currentHeart.dataset.crumb;
			currentHeart.classList.add('crumbed');
		}
		currentHeart = null;
	}

	// attach click handlers to hearts; only active once container is settled
	const hearts = document.querySelectorAll('.heart');
	hearts.forEach(h=>{
		h.addEventListener('click', function(e){
			// ignore if not settled yet or this heart has been crumbed (disabled)
			if(!container.classList.contains('settled')) return;
			if(h.classList.contains('crumbed')) return;
			openModalForHeart(h);
		});
	});

	// close interactions
	if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
	if(modal){
		modal.addEventListener('click', function(e){
			if(e.target === modal || e.target.classList.contains('modal-backdrop')) closeModal();
		});
	}
});