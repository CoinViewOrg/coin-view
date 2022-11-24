import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    const { container } = render(<Home data={[]} meta={undefined} />)

    const title = screen.getByText('Coin View')
    const element = screen.getByText((content, element) => content.startsWith('Coin'))
    expect(title).toBeInTheDocument()

    expect(container).toMatchSnapshot()
  })
})