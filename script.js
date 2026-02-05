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
		let closeup = heartEl.dataset.closeup || heartEl.getAttribute('src') || '';
		// if this heart is the temporary smile heart (or already the final candy),
		// show the final candy closeup in the modal instead of the default closeup
		const src = heartEl.getAttribute('src') || '';
		let specialCase = false;
		if(src.indexOf('smileheart.svg') !== -1 || src.indexOf('finalcandyheart.svg') !== -1){
			closeup = 'assets/finalcandyheart.svg';
			// show final candy in the middle and YES images on sides
			const center = document.querySelector('.heart.xoxo');
			const left = document.querySelector('.heart.loveya');
			const right = document.querySelector('.heart.urcute');
			const subtitle = document.querySelector('.subtitle');;
			if(subtitle){
					subtitle.textContent = 'Choose wisely >:(';
			}

			if(center){
				center.src = 'assets/finalcandyheart.svg';
				center.alt = 'final candy heart';
			}
			if(left){
				left.src = 'assets/yes1.svg';
				left.alt = 'YES';
				left.classList.remove('crumbed');
				left.dataset.crumb = '';
			}
			if(right){
				right.src = 'assets/yes2.svg';
				right.alt = 'YES';
				right.classList.remove('crumbed');
				right.dataset.crumb = '';
			}
			// open modal without backdrop or close button for this special case
			modal.classList.add('no-backdrop','no-close');
			// hide the close button and mark it hidden for accessibility
			if(modalCloseBtn){
				modalCloseBtn.style.display = 'none';
				modalCloseBtn.setAttribute('aria-hidden','true');
			}
			// make the modal background clear so underlying page shows through
			if(modal) modal.style.background = 'transparent';
			specialCase = true;
		}
		modalImg.src = closeup;
		modalImg.alt = (src.indexOf('finalcandyheart.svg') !== -1 || src.indexOf('smileheart.svg') !== -1) ? 'final candy' : (heartEl.alt || '');
		if(modalText) modalText.textContent = heartEl.dataset.text || heartEl.alt || '';
		modal.classList.add('open');
		modal.setAttribute('aria-hidden','false');
		currentHeart = specialCase ? null : heartEl;
	}

	function closeModal(){
		if(!modal) return;
		modal.classList.remove('open');
		// ensure any special modal flags are cleared
		modal.classList.remove('no-backdrop','no-close');
		modal.setAttribute('aria-hidden','true');
		modalImg.src = '';
		if(modalText) modalText.textContent = '';
		// restore close button and background when modal closes
		if(modalCloseBtn){
			modalCloseBtn.style.display = '';
			modalCloseBtn.removeAttribute('aria-hidden');
		}
		if(modal) modal.style.background = '';

		// replace the heart image with the crumb image
		if(currentHeart && currentHeart.dataset.crumb){
			currentHeart.src = currentHeart.dataset.crumb;
			currentHeart.classList.add('crumbed');

			// if all hearts are crumbed, update the subtitle to the final message
			const allHearts = document.querySelectorAll('.heart');
			const crumbed = document.querySelectorAll('.heart.crumbed');
			if(allHearts.length > 0 && crumbed.length === allHearts.length){
				const header = document.querySelector('.site-header');
				if(header){
					let subtitle = header.querySelector('.subtitle');
					if(!subtitle){
						subtitle = document.createElement('p');
						subtitle.className = 'subtitle subtitle--up';
						header.appendChild(subtitle);
					}
					subtitle.textContent = 'Aw Man... You ate it all :(';
					subtitle.classList.remove('subtitle--hidden');
					subtitle.classList.add('subtitle--up');

					// after a short pause, swap to the playful follow-up message with a fade transition
					setTimeout(()=>{
						// fade out
						subtitle.classList.add('subtitle--hidden');
						setTimeout(()=>{
							// change text and fade back in
							subtitle.textContent = "Wait I think there's one more candy!";
							// swap the XOXO heart image to the smile heart
							const xoxo = document.querySelector('.heart.xoxo');
							if(xoxo){
								xoxo.src = 'assets/smileheart.svg';
								xoxo.alt = 'smile heart';
								xoxo.classList.remove('crumbed');
							}
							subtitle.classList.remove('subtitle--hidden');
							subtitle.classList.add('subtitle--up');
						}, 420); 
					}, 1400);
				}
			}
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
	if(modalCloseBtn) modalCloseBtn.addEventListener('click', function(e){
		// prevent closing when final-candy modal disables closing
		if(modal && modal.classList.contains('no-close')) return;
		closeModal();
	});
	if(modal){
		modal.addEventListener('click', function(e){
			// when final candy is shown we intentionally disable backdrop/outer clicks
			if(modal.classList.contains('no-backdrop')) return;
			if(e.target === modal || e.target.classList.contains('modal-backdrop')) closeModal();
		});
	}
});
