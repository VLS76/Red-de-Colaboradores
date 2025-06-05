document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE EJEMPLO (15 Personas) ---
    const allPeople = [
        { id: 1, nombre: 'Ana G.', especie: ['Ovina', 'Caprina'], dispositivo: ['RFID', 'Collares'], estudio: ['Comportamiento social'], proyecto: ['Project1'], status: 'IP', institucion: 'UPV' },
        { id: 2, nombre: 'Luis M.', especie: ['Ovina'], dispositivo: ['RFID', 'Básculas'], estudio: ['Comportamiento social', 'Nutrición'], proyecto: ['Project1'], status: 'Predoc', institucion: 'UPV' },
        { id: 3, nombre: 'Carla S.', especie: ['Vacuna'], dispositivo: ['Drones', 'IA', 'Cámaras de visión'], estudio: ['Manejo'], proyecto: ['Project2', 'Project3'], status: 'IP', institucion: 'UCO' },
        { id: 4, nombre: 'David F.', especie: ['Porcina'], dispositivo: ['Alimentadores automáticos', 'Sensores de movimiento'], estudio: ['Comportamiento alimenticio'], proyecto: ['Project4'], status: 'Postdoc', institucion: 'UdL' },
        { id: 5, nombre: 'Elena P.', especie: ['Avícola'], dispositivo: ['Sensores acústicos', 'IA'], estudio: ['Salud'], proyecto: ['Project2'], status: 'Técnico', institucion: 'UAB' },
        { id: 6, nombre: 'Marco V.', especie: ['Cunícula', 'Porcina'], dispositivo: ['Vallados virtuales'], estudio: ['Manejo'], proyecto: ['Project3'], status: 'IP', institucion: 'USAL' },
        { id: 7, nombre: 'Sara R.', especie: ['Vacuna'], dispositivo: ['Collares', 'IA'], estudio: ['Comportamiento social', 'Manejo'], proyecto: ['Project3'], status: 'Postdoc', institucion: 'UCO' },
        { id: 8, nombre: 'Jorge T.', especie: ['Caprina'], dispositivo: ['Drones'], estudio: ['Salud'], proyecto: ['Project1'], status: 'Predoc', institucion: 'USAL' },
        { id: 9, nombre: 'Laura B.', especie: ['Ovina'], dispositivo: ['RFID'], estudio: ['Nutrición'], proyecto: ['Project4'], status: 'Técnico', institucion: 'UPV' },
        { id: 10, nombre: 'Pablo N.', especie: ['Porcina', 'Avícola'], dispositivo: ['IA', 'Alimentadores automáticos'], estudio: ['Comportamiento alimenticio'], proyecto: ['Project2'], status: 'IP', institucion: 'UdL' },
        { id: 11, nombre: 'Sofía C.', especie: ['Vacuna'], dispositivo: ['Básculas', 'Cámaras de visión'], estudio: ['Nutrición'], proyecto: ['Project3'], status: 'Predoc', institucion: 'UCO' },
        { id: 12, nombre: 'Miguel H.', especie: ['Ovina', 'Cunícula'], dispositivo: ['Vallados virtuales', 'Sensores de movimiento'], estudio: ['Manejo'], proyecto: ['Project1', 'Project4'], status: 'Postdoc', institucion: 'USAL' },
        { id: 13, nombre: 'Isabel J.', especie: ['Caprina'], dispositivo: ['Collares'], estudio: ['Comportamiento social'], proyecto: ['Project1'], status: 'Técnico', institucion: 'UPV' },
        { id: 14, nombre: 'Felipe Z.', especie: ['Porcina'], dispositivo: ['RFID'], estudio: ['Salud'], proyecto: ['Project2'], status: 'Predoc', institucion: 'UdL' },
        { id: 15, nombre: 'Raquel D.', especie: ['Avícola'], dispositivo: ['Drones', 'Sensores acústicos'], estudio: ['Manejo'], proyecto: ['Project4'], status: 'IP', institucion: 'UAB' }
    ];

    const categoryMap = {
        'especie': 'Especie', 'dispositivo': 'Dispositivos', 'estudio': 'Estudios',
        'proyecto': 'Proyectos', 'status': 'Status', 'institucion': 'Institución'
    };

    const colors = { 'IP': '#d62728', 'Postdoc': '#ff7f0e', 'Predoc': '#2ca02c', 'Técnico': '#1f77b4' };
    const institutionColors = d3.scaleOrdinal(d3.schemeCategory10);

    // --- ELEMENTOS DEL DOM ---
    const detailBox = document.getElementById('detail-box');
    const detailName = document.getElementById('detail-name');
    const detailContent = document.getElementById('detail-content');
    const closeDetailBoxBtn = document.getElementById('close-detail-box');

    const svg = d3.select("#network-graph");
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2));

    let link = svg.append("g").attr("class", "links").selectAll("line");
    let node = svg.append("g").attr("class", "nodes").selectAll("g.node");

    function getSelectedFilters() { /* ... (sin cambios) ... */
        const selected = {};
        document.querySelectorAll('.filter-group').forEach(group => {
            const category = group.id.replace('group-', '');
            selected[category] = Array.from(group.querySelectorAll('input:checked')).map(input => input.value);
        });
        return selected;
    }

    function updateGraph() { /* ... (sin cambios en la lógica de filtrado) ... */
        const filters = getSelectedFilters();
        const noFiltersApplied = Object.values(filters).every(arr => arr.length === 0);
        let filteredPeople = noFiltersApplied ? allPeople : allPeople.filter(person => {
            return Object.entries(filters).some(([category, values]) => {
                if (values.length === 0) return false;
                const personValues = Array.isArray(person[category]) ? person[category] : [person[category]];
                return personValues.some(item => values.includes(item));
            });
        });
        
        const nodes = filteredPeople.map(p => ({...p}));
        const links = [];
        if (nodes.length > 1) {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const p1 = nodes[i]; const p2 = nodes[j];
                    const commonFields = Object.keys(categoryMap).filter(key => {
                        const v1 = Array.isArray(p1[key]) ? p1[key] : [p1[key]];
                        const v2 = Array.isArray(p2[key]) ? p2[key] : [p2[key]];
                        return v1.some(item => v2.includes(item));
                    });
                    if (commonFields.length > 0) links.push({ source: p1.id, target: p2.id, weight: commonFields.length });
                }
            }
        }
        
        const institutionGroups = d3.group(nodes, d => d.institucion);
        simulation.force("link").links(links).distance(d => 150 - d.weight * 15);
        institutionGroups.forEach((group) => {
            const ips = group.filter(p => p.status === 'IP');
            if (ips.length > 0) {
                group.forEach(person => {
                    if (person.status !== 'IP') {
                        links.push({source: person.id, target: ips[0].id, isSatellite: true});
                    }
                });
            }
        });

        simulation.nodes(nodes).on("tick", ticked);

        link = link.data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`);
        link.exit().remove();
        link = link.enter().append("line")
            .attr("stroke-width", d => d.isSatellite ? 1 : 1 + d.weight)
            .attr("stroke", d => d.isSatellite ? "#ddd" : "#999")
            .attr("stroke-opacity", 0.7)
            .merge(link);

        node = node.data(nodes, d => d.id);
        node.exit().remove();

        const nodeEnter = node.enter().append("g").attr("class", "node")
            .call(drag(simulation))
            .on("click", showDetails); // <-- AÑADIDO: Evento de clic en el nodo

        nodeEnter.append("circle")
            .attr("r", d => (d.status !== 'IP' && institutionGroups.get(d.institucion)?.some(p => p.status === 'IP')) ? 12 : 18)
            .attr("fill", d => colors[d.status] || '#ccc')
            .attr("stroke", d => institutionColors(d.institucion))
            .attr("stroke-width", 3);

        nodeEnter.append("text")
            .attr("dy", d => (d.status !== 'IP' && institutionGroups.get(d.institucion)?.some(p => p.status === 'IP')) ? "-16px" : "-22px")
            .text(d => d.nombre);
        
        node = nodeEnter.merge(node);
        node.select('circle')
             .transition().duration(200)
             .attr("r", d => (d.status !== 'IP' && institutionGroups.get(d.institucion)?.some(p => p.status === 'IP')) ? 12 : 18)
             .attr("fill", d => colors[d.status] || '#ccc');

        simulation.alpha(1).restart();
        hideDetails(); // Ocultar detalles al actualizar el filtro
    }
    
    // --- FUNCIONES PARA EL RECUADRO DE DETALLES ---
    function showDetails(event, d) {
        event.stopPropagation(); // Evita que el clic se propague al SVG y cierre el panel
        detailName.textContent = d.nombre;
        detailContent.innerHTML = ''; // Limpiar contenido anterior

        for (const [key, title] of Object.entries(categoryMap)) {
            const values = Array.isArray(d[key]) ? d[key] : [d[key]];
            if (values && values.length > 0) {
                const titleEl = document.createElement('h4');
                titleEl.textContent = title;
                detailContent.appendChild(titleEl);

                const listEl = document.createElement('ul');
                values.forEach(val => {
                    const itemEl = document.createElement('li');
                    itemEl.textContent = val;
                    listEl.appendChild(itemEl);
                });
                detailContent.appendChild(listEl);
            }
        }
        detailBox.classList.add('visible');
    }

    function hideDetails() {
        detailBox.classList.remove('visible');
    }

    function ticked() { /* ... (sin cambios) ... */
        link.attr("x1", d=>d.source.x).attr("y1", d=>d.source.y).attr("x2", d=>d.target.x).attr("y2", d=>d.target.y);
        node.attr("transform", d=>`translate(${d.x},${d.y})`);
    }

    function drag(simulation) { /* ... (sin cambios) ... */
        function dragstarted(event, d) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
        function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
        function dragended(event, d) { if (!event.active) simulation.alphaTarget(0); if (!event.sourceEvent.ctrlKey) { d.fx = null; d.fy = null; } }
        return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
    }
    
    // --- EVENT LISTENERS ---
    document.querySelectorAll('.filter-panel input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateGraph);
    });

    closeDetailBoxBtn.addEventListener('click', hideDetails);
    svg.on('click', hideDetails); // Cierra el panel si se hace clic en el fondo

    updateGraph(); // Carga inicial
});
