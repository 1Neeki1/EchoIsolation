const interactables = [];

export function addInteractable(
    mesh,
    name,
    action
) {

    interactables.push({
        mesh,
        name,
        action
    });
}

export function removeInteractable(
    mesh
) {

    const index =
    interactables.findIndex(
        obj => obj.mesh === mesh
    );

    if (index !== -1) {

        interactables.splice(
            index,
            1
        );
    }
}

export function getClosestInteractable(
    camera
) {

    let closest = null;
    let closestDistance = 3;

    for (
        const obj
        of interactables
    ) {

        const distance =
        camera.position.distanceTo(
            obj.mesh.position
        );

        if (
            distance <
            closestDistance
        ) {

            closest = obj;
            closestDistance =
            distance;
        }
    }

    return closest;
}