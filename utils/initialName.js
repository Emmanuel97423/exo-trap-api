const initialName = (firstName, lastName) => {
    const firstInit = firstName.charAt(0)
    const lastInit = lastName.charAt(0)

    return firstInit + lastInit
}

module.exports = initialName