export const StorePageLayout = ({title, actions, children}) => {


    return (
        <main>
            <header>
                <h1>{title}</h1>
                {actions && <div className="page-actions">{actions}</div>}
            </header>
            <section>{children}</section>
        </main>
    )
}