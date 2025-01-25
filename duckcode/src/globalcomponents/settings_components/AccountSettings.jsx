export default function AccountSettings() {
    const user = {
        userId: '12345678',
        username: 'duck_administrator_420',
        email: 'iloveduckcode@duckcode.org',
        profile: {
            avatar: "https://upload-os-bbs.hoyolab.com/upload/2022/08/22/11424699/210b0082f66875297c0b00a9fc770f21_5633321273991244528.jpg",
            level: 38,
            exp: 1200,
        }
    }

    return (
        <div id="account-settings">
            <form id="account-settings-form">
                <h2>Gameplay</h2>
                <img src={user.profile.avatar} alt="avatar" />
            </form>
        </div>
    )
}