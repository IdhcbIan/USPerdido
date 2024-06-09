
// ---------- Boxes ---------- //

document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('mouseover', () => {
        box.classList.add('hover_effect_box');
    });
    box.addEventListener('mouseout', () => {
        box.classList.remove('hover_effect_box');
    });
})

// ---------- Communities ---------- //

let  community1 = document.getElementById('community1');
let  community2 = document.getElementById('community2');
let  community3 = document.getElementById('community3');
let  community4 = document.getElementById('community4');
let  community5 = document.getElementById('community5');
let communities = [community1, community2, community3, community4, community5];

communities.forEach(community => {communities_animations(community);});

function communities_animations(community) {
    community.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'c1/c1.html';
    });

    community.addEventListener('mouseover', function(event) {
        event.preventDefault();

        community.classList.add('hover_effect');
    });

    community.addEventListener('mouseleave', function(event) {
        event.preventDefault();

        community.classList.remove('hover_effect');
    });
}