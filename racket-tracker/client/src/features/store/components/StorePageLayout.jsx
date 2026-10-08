export const StorePageLayout = ({title, actions, footer, children}) => {


    return (
        <main>
            <header className="store-header">
                <h1>{title}</h1>
                {actions && 
                    <div className="page-actions">{actions}</div>
                }
            </header>
            <section className="store-content">{children}</section>
            {footer &&
                <footer className="store-footer">{footer}</footer>
            }           
        </main>
    )
}