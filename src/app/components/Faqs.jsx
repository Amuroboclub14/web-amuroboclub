
const faqs = [
    {
      "id": 1,
      "question": "How can I join the robotics club? Is there an application process?",
      "answer": "You can download the AMURoboclub Android App and join the club from there. A nominal membership fee of Rs. 200/- is charged which gives you access to the club's inventory, experts and exclusive classes as well as discounts on various events we conduct throughout the year."
  },
  {
      "id": 2,
      "question": "What types of robots does your club build?",
      "answer": "Our club builds a variety of robot types including wheeled robots, drones, robotic arms, and even robots that can swim underwater! We like taking on new challenges and building different kinds of robots every year."
  },
  {
      "id": 3,
      "question": "Where can I visit the club?",
      "answer": "WS-18, Department of Mechnical Engineering, AMU Campus · 090454 14527"
  },
  {
      "id": 4,
      "question": "What resources or parts does the club provide for building robots?",
      "answer": "Our club has a parts inventory with things like motors, sensors, controllers and structural materials that members can use for their robot projects. We also have access to 3D printers, laser cutters and a full woodshop to build custom parts."
  },
  {
      "id": 5,
      "question": "What competitions or events does the club participate in?",
      "answer": "Each year our club competes in various national competitions (like Smart India Hackathon) as well as international ones like in the ABU Asia-Pacific Robot Contest."
  },
  {
      "id": 6,
      "question": "Do you have to know how to code or have robotics experience to join?",
      "answer": "No experience required! Our members have a wide range of skill levels. We teach coding and electronics skills needed so anyone can learn."
  }
  
  ]
const Faqs = () => {
    
    return(
        <>
        <div className="bg-lightblue">
        <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8" id='faqs'>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Frequently asked questions</h2>
          </div>
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="space-y-2">
                  <div>
                    <dt className="text-lg leading-6 font-medium text-gray-900">{faq.question}</dt>
                    <dd className="text-base text-gray-500">{faq.answer}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

        </>
    )
}

export default Faqs;