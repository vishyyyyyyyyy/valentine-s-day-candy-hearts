const music = new Audio('assets/valentine-tune.mp3');
music.loop = true;
music.volume = 0.5;
music.play();


document.addEventListener('DOMContentLoaded', function(){
	const box = document.getElementById('box');
	const container = document.getElementById('boxContainer');
	if(!box || !container) return;
	let celebrated = false;


	function activateBox(){
		// only open once
		if(container.classList.contains('open')) return;

		box.classList.add('pressed');
		setTimeout(()=> box.classList.remove('pressed'), 200);

		container.classList.add('open');
		box.setAttribute('aria-pressed', 'true');

		// update the subtitle text and move up, remove header
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

		// after open animation finishes, move box away and hearts
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
		const src = heartEl.getAttribute('src') || '';
		let specialCase = false;

		// show the chooser question candy with YEssss
		if(src.indexOf('questioncandyheart.svg') !== -1){
			closeup = 'assets/cats/questioncandyheart.svg';
			const center = document.querySelector('.heart.xoxo');
			const left = document.querySelector('.heart.loveya');
			const right = document.querySelector('.heart.urcute');
			const subtitle = document.querySelector('.subtitle');
			if(subtitle){ subtitle.textContent = 'Choose wisely >:('; }

			if(center){
				center.src = 'assets/cats/questioncandyheart.svg';
				center.alt = 'final candy heart';
				console.log(center.className);
			}
			if(left){ left.src = 'assets/yes1.svg'; left.alt = 'YES'; 
				left.classList.remove('crumbed'); 
				left.dataset.crumb = ''; 
				left.style.visibility = '';
			} 
			if(right){ 
				right.src = 'assets/yes2.svg';
				right.alt = 'YES';
				right.classList.remove('crumbed');
				right.dataset.crumb = '';
				right.style.visibility = '';
			 }

			modal.classList.add('no-backdrop','no-close');
			if(modalCloseBtn){ 
				modalCloseBtn.style.display = 'none';
				modalCloseBtn.setAttribute('aria-hidden','true'); }
			if(modal) modal.style.background = 'transparent';
			specialCase = true;
		} else if(src.indexOf('smileheart.svg') !== -1){
			closeup = 'assets/cats/questioncandyheart.svg';
			const center = document.querySelector('.heart.xoxo');
			const left = document.querySelector('.heart.loveya');
			const right = document.querySelector('.heart.urcute');
			const subtitle = document.querySelector('.subtitle');
			if(subtitle){ subtitle.textContent = 'Choose wisely >:('; }

			// update on-page hearts to show the YES side images so they remain clickable
			if(center){
				center.src = 'assets/cats/questioncandyheart.svg';
				center.alt = 'final candy heart';
			}
			if(left){ 
				left.src = 'assets/yes1.svg'; 
				left.alt = 'YES'; 
				left.classList.remove('crumbed'); 
				left.classList.add('question');
				left.classList.add('question-top');
				left.dataset.crumb = ''; 
				left.style.visibility = ''; 
			}
			if(right){ 
				right.src = 'assets/yes2.svg'; 
				right.alt = 'YES'; 
				right.classList.remove('crumbed'); 
				right.classList.add('question');
				right.classList.add('question-bottom');
				right.dataset.crumb = ''; 
				right.style.visibility = ''; 
			}

			// Show modal but no balck bg
			if(modal){
				modal.classList.add('no-backdrop','no-close','open');
				modal.setAttribute('aria-hidden','false');
				if(modalCloseBtn){ 
					modalCloseBtn.style.display = 'none'; 
					modalCloseBtn.setAttribute('aria-hidden','true'); 
				}
				modal.style.background = 'transparent';
				// allow clicks to pass through the modal so on-page YES hearts remain clickable
				modal.style.pointerEvents = 'none';
				// also ensure the modal image doesn't capture pointer events
				if(modalImg) modalImg.style.pointerEvents = 'none';
				// set the modal image directly so it displays large
				if(modalImg) { 
					modalImg.src = closeup; 
					modalImg.alt = 'question candy'; 
				}
			}
			specialCase = true;
		}

		// If the clicked heart is one of the YES side images, treat as the final selection
		if(src.indexOf('yes1.svg') !== -1 || src.indexOf('yes2.svg') !== -1){
			const center = document.querySelector('.heart.xoxo');
			const left = document.querySelector('.heart.loveya');
			const right = document.querySelector('.heart.urcute');
			// Do NOT change the on-page center heart immediately -
			// show the final heart in the modal first to avoid a double transition.
			if(left) left.style.visibility = 'hidden';
			if(right) right.style.visibility = 'hidden';


			// If the chooser is currently shown in the modal, swap the modal image
			// to the final candy so the user sees the change, then celebrate.
			if(modal && modal.classList.contains('open')){
				
					// close the modal
					if(modal) modal.classList.remove('open');
					triggerCelebrate();
			}
			currentHeart = null;
			specialCase = true;
		}

		modalImg.src = closeup;
		modalImg.alt = (src.indexOf('finalcandyheart.svg') !== -1 || src.indexOf('smileheart.svg') !== -1) ? 'final candy' : (heartEl.alt || '');
		if(modalText) modalText.textContent = heartEl.dataset.text || heartEl.alt || '';
		// Only open the modal for normal hearts. For the "chooser"
		// special case we update the on-page hearts so the YES images remain clickable.
		if(!specialCase){
			modal.classList.add('open');
			modal.setAttribute('aria-hidden','false');
			currentHeart = heartEl;
		} else {
			currentHeart = null;
		}
	}

	function closeModal(){
		if(!modal) return;
		modal.classList.remove('open');
		modal.classList.remove('no-backdrop','no-close');
		modal.setAttribute('aria-hidden','true');
		modalImg.src = '';
		if(modalText) modalText.textContent = '';

		// restore close button and background when modal closes
		if(modalCloseBtn){ modalCloseBtn.style.display = ''; modalCloseBtn.removeAttribute('aria-hidden'); }
		if(modal) modal.style.background = '';

		// restore pointer events in case the modal had been made click-through
		if(modal) modal.style.pointerEvents = '';
		if(modalImg) modalImg.style.pointerEvents = '';

		// remove decorative mini-love icons and restore side hearts
		const left = document.querySelector('.heart.loveya');
		const right = document.querySelector('.heart.urcute');
		if(left) left.style.visibility = '';
		if(right) right.style.visibility = '';
		// remove temporary question positioning classes (for narrow screens)
		if(left){ left.classList.remove('question','question-top','question-bottom'); }
		if(right){ right.classList.remove('question','question-top','question-bottom'); }
		document.querySelectorAll('.mini-love').forEach(n=>n.remove());

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

					//one more candysition
					setTimeout(()=>{
						// fade out
						subtitle.classList.add('subtitle--hidden');
						setTimeout(()=>{
							// change text and fade back in
							subtitle.textContent = "Wait I think there's one more candy!";
							// swap the XOXO heart image to the smile heart
							const xoxo = document.querySelector('.heart.xoxo');
							if(xoxo){ xoxo.src = 'assets/smileheart.svg'; xoxo.alt = 'smile heart'; xoxo.classList.remove('crumbed'); }
							subtitle.classList.remove('subtitle--hidden');
							subtitle.classList.add('subtitle--up');
						}, 1000); 
					}, 1000);
				}
			}
		}
		currentHeart = null;
	}

	// trigger full-page celebration view after YES selection
	function triggerCelebrate(){
		// hide modal if open
		if(modal) modal.classList.remove('open');

		// update header subtitle to celebrate
		const header = document.querySelector('.site-header');
		if(header){
			let subtitle = header.querySelector('.subtitle');
			if(!subtitle){
				subtitle = document.createElement('p');
				subtitle.className = 'subtitle subtitle--up';
				header.appendChild(subtitle);
			}
			subtitle.textContent = 'YIPEEE! I LOVE YOUUU MWAHHH~';
			subtitle.classList.remove('subtitle--hidden');
			subtitle.classList.add('subtitle--up');
		}

		// mark container as celebration state
		container.classList.add('celebrate');

		// center heart becomes final candy
		const center = document.querySelector('.heart.xoxo');
		const left = document.querySelector('.heart.loveya');
		const right = document.querySelector('.heart.urcute');
		if(center){
			center.src = 'assets/cats/finalcandyheart.svg';
			center.alt = 'final candy heart';
			// disable further interaction on the final heart
			center.classList.add('final');
			console.log(center.className);
			center.style.pointerEvents = 'none';
		}
		if(left) left.style.display = 'none';
		if(right) right.style.display = 'none';


		// add floating mini hearts around the screen 
		const positions = [
			{left:'8%', top:'22%'}, {left:'18%', top:'58%'}, {left:'28%', top:'36%'},
			{right:'8%', top:'22%'}, {right:'18%', top:'58%'}, {right:'28%', top:'36%'},
			{left:'35%', top:'8%'}, {left:'60%', top:'72%'}
		];
		positions.forEach((pos,i)=>{
			if(document.querySelector('.float-heart-'+i)) return;
			const f = document.createElement('img');
			f.src = 'assets/minilove.svg';
			f.className = 'float-heart float-heart-'+i;
			f.style.position = 'fixed';
			f.style.zIndex = 8;
			f.style.pointerEvents = 'none';
			if(pos.left) f.style.left = pos.left;
			if(pos.right) f.style.right = pos.right;
			f.style.top = pos.top;
			document.body.appendChild(f);
			// show animation
			requestAnimationFrame(()=> f.classList.add('show'));
		});
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
			if(modal.classList.contains('no-backdrop')) return;
			if(e.target === modal || e.target.classList.contains('modal-backdrop')) closeModal();
		});
	}
});
