icons = Object.keys(lucide.icons)
pickerTarget = 0
let config

elements = {
	grid: document.getElementById('grid'),
	list: document.getElementById('listBody'),
	settings: document.getElementById('settings'),
	listSettings: document.getElementById('listSettings'),
	gridSettings: document.getElementById('gridSettings'),
	results: document.getElementById('results'),
	picker: document.getElementById('fullscreen'),
	search: document.getElementById('search'),
	rows: document.getElementById('rows'),
	cols: document.getElementById('cols'),
}

browser.storage.local.get().then((response) => {
	if (Object.keys(response).length > 0) {
		config = response
	} else {
		config = defaults
		browser.storage.local.set(config)
	}

	document.documentElement.style.setProperty('--bg', config.theme.bg)
	document.documentElement.style.setProperty('--sf', config.theme.sf)
	document.documentElement.style.setProperty('--fg', config.theme.fg)
	document.documentElement.style.setProperty('--ac', config.theme.ac)
	document.getElementById('bg').value = config.theme.bg
	document.getElementById('sf').value = config.theme.sf
	document.getElementById('fg').value = config.theme.fg
	document.getElementById('ac').value = config.theme.ac

	cols.value = config.gridConfig.cols
	document.documentElement.style.setProperty('--cols', config.gridConfig.cols)

	loadTiles(true)
	loadList(true)
	populate()
})

function loadTiles(init) {
	elements.grid.innerHTML = ''
	elements.gridSettings.innerHTML = `
		<div id="gridConfig">
			<p>Columns:</p>
			<input type="number" id="cols" class="gridConfig" data-option="cols" value="${config.gridConfig.cols}">
		</div>
	`
	config.grid.forEach((tile, index) => {
		elements.grid.innerHTML += `<a class="tile" href="${tile.url}" target="_top">${tile.icon}</a>`
		elements.gridSettings.innerHTML += `
		<div class="grid-option">
			<div class="label">
				<button class="picker pickerButton" data-index="${index}">
					${tile.icon}
				</button>
			</div>
			<div class="label">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
				<input type="text" class="list-url gridUpdate" value="${tile.url}" data-index="${index}">
			</div>
			<div class="controls">
				<button class="gridUp" data-index="${index}">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
				</button>
				<button class="removeGrid" data-index="${index}">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
				</button>
				<button class="gridDown" data-index="${index}">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
				</button>
			</div>
		</div>
		`
	})
	elements.gridSettings.innerHTML += `
		<button class="new" id="newGridItem">New Tile</button>

	`
	if (!init) {
		populate()
	}
}
function loadList(init) {
	elements.list.innerHTML = ''
	elements.listSettings.innerHTML = ''
	config.list.forEach((item, index) => {
		elements.list.innerHTML += `<a class="entry" href="${item[1]}" target="_top">${item[0]}</a>`
		elements.listSettings.innerHTML += `
		<div class="list-option">
			<div class="label">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-case-sensitive"><path d="m3 15 4-8 4 8"/><path d="M4 13h6"/><circle cx="18" cy="12" r="3"/><path d="M21 9v6"/></svg>
				<input type="text" class="list-text listUpdate" value="${item[0]}" data-index="${index}" data-type="name">
			</div>
			<div class="label">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
				<input type="text" class="list-url listUpdate" value="${item[1]}" data-index="${index}" data-type="url">
			</div>
			<div class="controls">
				<button class="listUp" data-index="${index}">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
				</button>
				<button class="removeList" data-index="${index}">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
				</button>
				<button class="listDown" data-index="${index}">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
				</button>
			</div>
		</div>
		`
	})
	elements.listSettings.innerHTML += `
		<button id="newListItem" class="new">New Item</button>

	`
	if (!init) {
		populate()
	}
}

function moveListUp(event) {
	index = parseInt(event.target.closest('button').dataset.index)
	move = config.list[index]
	from = index
	to = index - 1
	if (to < 0) {
		return
	}
	;[config.list[from], config.list[to]] = [config.list[to], config.list[from]]

	loadList()
}

function moveListDown(event) {
	index = parseInt(event.target.closest('button').dataset.index)
	move = config.list[index]
	from = index
	to = index + 1
	if (to > config.list.length - 1) {
		return
	}
	;[config.list[from], config.list[to]] = [config.list[to], config.list[from]]

	loadList()
}

function removeList(event) {
	index = parseInt(event.target.closest('button').dataset.index)
	config.list.splice(index, 1)
	loadList()
}

function listUpdate(event) {
	index = parseInt(event.target.dataset.index)
	type = event.target.dataset.type
	value = event.target.value
	if (type == 'name') {
		config.list[index][0] = value
	} else if (type == 'url') {
		config.list[index][1] = value
	}
	loadList()
}

function listNew() {
	config.list.push(['', ''])
	loadList()
}

function moveGridUp(event) {
	index = parseInt(event.target.closest('button').dataset.index)
	move = config.grid[index]
	from = index
	to = index - 1
	if (to < 0) {
		return
	}
	;[config.grid[from], config.grid[to]] = [config.grid[to], config.grid[from]]

	loadTiles()
}

function moveGridDown(event) {
	index = parseInt(event.target.closest('button').dataset.index)
	move = config.grid[index]
	from = index
	to = index + 1
	if (to > config.grid.length - 1) {
		return
	}
	;[config.grid[from], config.grid[to]] = [config.grid[to], config.grid[from]]

	loadTiles()
}

function removeGrid(event) {
	index = parseInt(event.target.closest('button').dataset.index)
	config.grid.splice(index, 1)
	loadTiles()
}

function gridUpdate(event) {
	index = parseInt(event.target.dataset.index)
	value = event.target.value
	config.grid[index].url = value
	loadTiles()
}

function gridNew() {
	config.grid.push({ icon: '', url: '' })
	loadTiles()
}

function gridConfig(event) {
	value = parseInt(event.target.value)
	option = event.target.dataset.option
	if (!value) {
		return
	}
	config.gridConfig[option] = value
	document.documentElement.style.setProperty('--rows', config.gridConfig.rows)
	document.documentElement.style.setProperty('--cols', config.gridConfig.cols)
	loadTiles()
}

function themeUpdate(event) {
	src = event.target
	value = src.value
	tag = src.id

	document.documentElement.style.setProperty(`--${tag}`, value)
	config.theme[tag] = value
}

function themeSave() {
	browser.storage.local.set(config)
}

function settings() {
	elements.settings.classList.toggle('hidden')
}

function collapse(event) {
	target = event.target
	target = target.closest('.section')
	if (target.classList.contains('collapsed')) {
		document.getElementById('theme-chv').parentElement.parentElement.classList.add('collapsed')
		document.getElementById('list-chv').parentElement.parentElement.classList.add('collapsed')
		document.getElementById('grid-chv').parentElement.parentElement.classList.add('collapsed')
		target.classList.remove('collapsed')
	} else {
		target.classList.add('collapsed')
	}
}

function picker(event) {
	pickerTarget = event.target.closest('.pickerButton').dataset.index
	elements.search.value = ''
	elements.results.innerHTML = ''
	elements.picker.classList.remove('hidden')
}

function pick(event) {
	icon = event.target.closest('.result').dataset.icon
	elements.picker.classList.add('hidden')
	config.grid[pickerTarget].icon = toSvg(lucide[icon])

	loadTiles()
}

function search(event) {
	query = event.target.value
	matches = icons.filter((name) => name.toLowerCase().includes(query.toLowerCase()))
	display(matches)
}

function toSvg(icon) {
	const [tag, attrs, elements] = icon
	attributes = Object.entries(attrs)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ')

	children = elements
		.map(([tag, attr]) => {
			attr = Object.entries(attr)
				.map(([key, value]) => `${key}="${value}"`)
				.join(' ')
			return `<${tag} ${attr}></${tag}>`
		})
		.join('')

	return `<${tag} ${attributes}>${children}</${tag}>`
}

function display(icons) {
	elements.results.innerHTML = ''
	icons.forEach((icon) => {
		svg = toSvg(lucide[icon])
		button = document.createElement('button')
		button.className = 'result'
		button.addEventListener('click', pick)
		button.dataset.icon = icon
		button.innerHTML = svg
		elements.results.appendChild(button)
	})
}

function populate(re) {
	if (!re) {
		document.querySelectorAll('.themeUpdate').forEach((element) => {
			element.addEventListener('change', themeUpdate)
		})
		document.querySelectorAll('.collapse').forEach((element) => {
			element.addEventListener('click', collapse)
		})
		document.getElementById('settingsSwitch').addEventListener('click', settings)
		document.getElementById('fullscreen').addEventListener('click', function () {
			elements.picker.classList.add('hidden')
		})
		document.getElementById('save').addEventListener('click', themeSave)
		document.getElementById('picker').addEventListener('click', function (event) {
			event.stopPropagation()
		})
		document.getElementById('search').addEventListener('keyup', search)
	}
	document.querySelectorAll('.gridConfig').forEach((element) => {
		element.addEventListener('input', gridConfig)
	})
	document.getElementById('newListItem').addEventListener('click', listNew)
	document.querySelectorAll('.listDown').forEach((element) => {
		element.addEventListener('click', moveListDown)
	})
	document.querySelectorAll('.listUp').forEach((element) => {
		element.addEventListener('click', moveListUp)
	})
	document.querySelectorAll('.removeList').forEach((element) => {
		element.addEventListener('click', removeList)
	})
	document.querySelectorAll('.listUpdate').forEach((element) => {
		element.addEventListener('change', listUpdate)
	})
	document.getElementById('newGridItem').addEventListener('click', gridNew)
	document.querySelectorAll('.gridDown').forEach((element) => {
		element.addEventListener('click', moveGridDown)
	})
	document.querySelectorAll('.gridUp').forEach((element) => {
		element.addEventListener('click', moveGridUp)
	})
	document.querySelectorAll('.removeGrid').forEach((element) => {
		element.addEventListener('click', removeGrid)
	})
	document.querySelectorAll('.gridUpdate').forEach((element) => {
		element.addEventListener('change', gridUpdate)
	})
	document.querySelectorAll('.pickerButton').forEach((element) => {
		element.addEventListener('click', picker)
	})
}
