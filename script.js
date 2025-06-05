// script.js
const personas = [
    // El array de personas que te proporcioné anteriormente
    {
        id: 1,
        nombre: "Ana García",
        especie: ["Ovina", "Vacuna"],
        dispositivo: ["Drones", "RFID"],
        estudio: ["Comportamiento alimenticio"],
        proyecto: ["Project1", "Project3"],
        status: "IP",
        institucion: "UPV"
    },
    {
        id: 2,
        nombre: "Luis Fernández",
        especie: ["Caprina", "Porcina"],
        dispositivo: ["Collares", "Cámaras de visión"],
        estudio: ["Manejo", "Nutrición"],
        proyecto: ["Project2"],
        status: "Predoc",
        institucion: "UPV"
    },
    {
        id: 3,
        nombre: "María López",
        especie: ["Avícola"],
        dispositivo: ["IA", "Alimentadores automáticos"],
        estudio: ["Salud"],
        proyecto: ["Project4"],
        status: "IP",
        institucion: "UdL"
    },
    {
        id: 4,
        nombre: "Pedro Martínez",
        especie: ["Cunícula", "Vacuna"],
        dispositivo: ["Básculas", "Sensores acústicos"],
        estudio: ["Comportamiento social"],
        proyecto: ["Project1", "Project2"],
        status: "Postdoc",
        institucion: "UdL"
    },
    {
        id: 5,
        nombre: "Laura Pérez",
        especie: ["Ovina"],
        dispositivo: ["Sensores de movimiento", "Vallados virtuales"],
        estudio: ["Comportamiento alimenticio", "Nutrición"],
        proyecto: ["Project3"],
        status: "Técnico",
        institucion: "UCO"
    },
    {
        id: 6,
        nombre: "Jorge Ruiz",
        especie: ["Porcina"],
        dispositivo: ["Drones"],
        estudio: ["Manejo"],
        proyecto: ["Project4"],
        status: "IP",
        institucion: "UCO"
    },
    {
        id: 7,
        nombre: "Sofía Gómez",
        especie: ["Vacuna"],
        dispositivo: ["RFID"],
        estudio: ["Salud"],
        proyecto: ["Project1"],
        status: "Predoc",
        institucion: "UCO"
    },
    {
        id: 8,
        nombre: "Diego Sánchez",
        especie: ["Caprina"],
        dispositivo: ["Collares"],
        estudio: ["Nutrición"],
        proyecto: ["Project2"],
        status: "Postdoc",
        institucion: "USAL"
    },
    {
        id: 9,
        nombre: "Elena Díaz",
        especie: ["Avícola"],
        dispositivo: ["Cámaras de visión"],
        estudio: ["Comportamiento alimenticio"],
        proyecto: ["Project3"],
        status: "Técnico",
        institucion: "USAL"
    },
    {
        id: 10,
        nombre: "Pablo Vargas",
        especie: ["Cunícula"],
        dispositivo: ["IA"],
        estudio: ["Comportamiento social"],
        proyecto: ["Project4"],
        status: "IP",
        institucion: "USAL"
    },
    {
        id: 11,
        nombre: "Isabel Torres",
        especie: ["Ovina", "Caprina"],
        dispositivo: ["Alimentadores automáticos"],
        estudio: ["Manejo"],
        proyecto: ["Project1"],
        status: "Predoc",
        institucion: "UAB"
    },
    {
        id: 12,
        nombre: "Ricardo Castro",
        especie: ["Porcina", "Vacuna"],
        dispositivo: ["Básculas"],
        estudio: ["Nutrición"],
        proyecto: ["Project2"],
        status: "Postdoc",
        institucion: "UAB"
    },
    {
        id: 13,
        nombre: "Carmen Morales",
        especie: ["Avícola", "Cunícula"],
        dispositivo: ["Sensores acústicos"],
        estudio: ["Salud"],
        proyecto: ["Project3"],
        status: "IP",
        institucion: "UPV"
    },
    {
        id: 14,
        nombre: "Javier Serrano",
        especie: ["Ovina"],
        dispositivo: ["Sensores de movimiento"],
        estudio: ["Comportamiento alimenticio"],
        proyecto: ["Project4"],
        status: "Técnico",
        institucion: "UdL"
    },
    {
        id: 15,
        nombre: "Marta Gil",
        especie: ["Caprina"],
        dispositivo: ["Vallados virtuales"],
        estudio: ["Comportamiento social"],
        proyecto: ["Project1"],
        status: "Predoc",
        institucion: "UAB"
    }
];

const selectedFilters = {
    especie: [],
    dispositivo: [],
    estudio: [],
    proyecto: [],
    status: [],
    institucion: []
};

const filterGroups = document.querySelectorAll('.filter-group h3');
const checkboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
const networkVisualization = document.getElementById('network-visualization');
const popup = document.getElementById('person-details-popup');
const closeButton = document.querySelector('.popup .close-button');

// Función para alternar la visibilidad de los desplegables
filterGroups.forEach(group => {
    group.addEventListener('click', () => {
        const dropdown = group.nextElementSibling;
        dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    });
});

// Función para actualizar los filtros seleccionados y la visualización
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
        const category = event.target.closest('.dropdown-content').id.replace('-dropdown', '');
        const value = event.target.value;

        if (event.target.checked) {
            selectedFilters[category].push(value);
        } else {
            selectedFilters[category] = selectedFilters[category].filter(item => item !== value);
        }
        updateNetworkVisualization();
    });
});

function updateNetworkVisualization() {
    networkVisualization.innerHTML = ''; // Limpiar visualización anterior

    let filteredPeople = personas.filter(person => {
        let matches = true;
        // Para cada categoría de filtro, verifica si la persona tiene AL MENOS UN indicador seleccionado
        for (const category in selectedFilters) {
            if (selectedFilters[category].length > 0) {
                const personValues = Array.isArray(person[category]) ? person[category] : [person[category]]; // Asegura que sea un array
                const hasCommonIndicator = selectedFilters[category].some(filterValue =>
                    personValues.includes(filterValue)
                );
                if (!hasCommonIndicator) {
                    matches = false;
                    break;
                }
            }
        }
        return matches;
    });

    // Agrupar personas por institución para la visualización de red
    const peopleByInstitution = filteredPeople.reduce((acc, person) => {
        if (!acc[person.institucion]) {
            acc[person.institucion] = [];
        }
        acc[person.institucion].push(person);
        return acc;
    }, {});

    let xOffset = 20; // Posición inicial X
    let yOffset = 20; // Posición inicial Y
    const institutionSpacing = 150; // Espacio entre grupos de instituciones

    for (const institution in peopleByInstitution) {
        const institutionPeople = peopleByInstitution[institution];
        const ipsInInstitution = institutionPeople.filter(p => p.status === 'IP');

        // Determinar un centro para la institución (donde se ubicaría la IP si existe)
        let institutionCenterX = xOffset + 100; // Un valor arbitrario para centrar la institución
        let institutionCenterY = yOffset + 100;

        // Renderizar IPs primero
        ipsInInstitution.forEach(ip => {
            const node = document.createElement('div');
            node.className = 'person-node ip';
            node.textContent = ip.nombre;
            node.style.width = '100px';
            node.style.height = '100px';
            node.style.left = `${institutionCenterX - 50}px`; // Centrar IP
            node.style.top = `${institutionCenterY - 50}px`;
            node.dataset.personId = ip.id;
            node.addEventListener('click', () => showPersonDetails(ip));
            networkVisualization.appendChild(node);
        });

        // Renderizar no-IPs alrededor de las IPs (si hay IPs) o en el centro de la institución
        const nonIpsInInstitution = institutionPeople.filter(p => p.status !== 'IP');
        if (ipsInInstitution.length > 0) {
            // Posicionar no-IPs satelitalmente
            const angleStep = (2 * Math.PI) / nonIpsInInstitution.length;
            const radius = 80; // Distancia del satélite

            nonIpsInInstitution.forEach((nonIp, index) => {
                const angle = index * angleStep;
                const nodeX = institutionCenterX + radius * Math.cos(angle);
                const nodeY = institutionCenterY + radius * Math.sin(angle);

                const node = document.createElement('div');
                node.className = 'person-node non-ip';
                node.textContent = nonIp.nombre;
                node.style.width = '70px'; // Tamaño ligeramente menor
                node.style.height = '70px';
                node.style.left = `${nodeX - 35}px`; // Centrar el nodo
                node.style.top = `${nodeY - 35}px`;
                node.dataset.personId = nonIp.id;
                node.addEventListener('click', () => showPersonDetails(nonIp));
                networkVisualization.appendChild(node);
            });
        } else {
            // Si no hay IPs, posicionar las no-IPs en línea o de forma simple en el centro
            nonIpsInInstitution.forEach((nonIp, index) => {
                const node = document.createElement('div');
                node.className = 'person-node non-ip';
                node.textContent = nonIp.nombre;
                node.style.width = '70px';
                node.style.height = '70px';
                node.style.left = `${institutionCenterX - 35 + (index * 80)}px`;
                node.style.top = `${institutionCenterY - 35}px`;
                node.dataset.personId = nonIp.id;
                node.addEventListener('click', () => showPersonDetails(nonIp));
                networkVisualization.appendChild(node);
            });
        }

        // Mover el offset para la siguiente institución
        xOffset += 250; // Ajusta según el tamaño de tus nodos y el espaciado deseado
        if (xOffset + 200 > networkVisualization.offsetWidth) { // Si se sale del ancho, baja de línea
            xOffset = 20;
            yOffset += institutionSpacing;
        }
    }
}

// Funcionalidad del popup de detalles
function showPersonDetails(person) {
    document.getElementById('popup-person-name').textContent = person.nombre;
    document.getElementById('popup-especie').textContent = Array.isArray(person.especie) ? person.especie.join(', ') : person.especie;
    document.getElementById('popup-dispositivo').textContent = Array.isArray(person.dispositivo) ? person.dispositivo.join(', ') : person.dispositivo;
    document.getElementById('popup-estudio').textContent = Array.isArray(person.estudio) ? person.estudio.join(', ') : person.estudio;
    document.getElementById('popup-proyecto').textContent = Array.isArray(person.proyecto) ? person.proyecto.join(', ') : person.proyecto;
    document.getElementById('popup-status').textContent = person.status;
    document.getElementById('popup-institucion').textContent = person.institucion;
    popup.style.display = 'flex'; // Mostrar el popup
}

closeButton.addEventListener('click', () => {
    popup.style.display = 'none'; // Ocultar el popup al hacer clic en la X
});

// Ocultar el popup si se hace clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

// Inicializar la visualización al cargar la página
document.addEventListener('DOMContentLoaded', updateNetworkVisualization);
